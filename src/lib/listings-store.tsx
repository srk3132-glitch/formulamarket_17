import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getCropImage } from "@/lib/crop-images";
import { getSupabase, getStoredSupabaseConfig } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export { getCropImage };

export type ListingStatus = "active" | "paused" | "sold" | "expired";

export type Listing = {
  id: string;
  cropId: string;
  crop?: string;
  quantity: number;
  unit: string;
  price: number;
  askPrice?: number;
  farmer: string;
  farmerName?: string;
  phone: string;
  stateId: string;
  state?: string;
  districtId: string;
  district?: string;
  placeId: string;
  placeName: string;
  mandi?: string;
  distanceKm: number;
  status: ListingStatus;
  createdAt?: string;
  expiresAt?: string;
  farmerId?: string;
  isRealtimeNew?: boolean;
};

// Database row mapping helper supporting both standard and legacy schemas
export function mapDbToListing(row: Record<string, unknown>): Listing {
  const crop = String(row.crop || row.crop_id || row.cropId || "tomato");
  const state = String(row.state || row.state_id || row.stateId || "tn");
  const district = String(row.district || row.district_id || row.districtId || "");
  const mandi = String(row.mandi || row.place_name || row.placeName || "");
  const farmer = String(row.farmer_name || row.farmer || "Farmer");
  const price = Number(row.ask_price ?? row.price ?? 0);
  const quantity = Number(row.quantity ?? 1);
  const unit = String(row.unit || "quintal");
  const status: ListingStatus = (row.status as ListingStatus) || "active";

  return {
    id: String(row.id || `lst_${Date.now()}`),
    cropId: crop,
    crop,
    quantity,
    unit,
    price,
    askPrice: price,
    farmer,
    farmerName: farmer,
    phone: String(row.phone || ""),
    stateId: state,
    state,
    districtId: district,
    district,
    placeId: String(row.place_id || mandi.toLowerCase().replace(/\s+/g, "-")),
    placeName: mandi,
    mandi,
    distanceKm: Number(row.distance_km ?? 5),
    status,
    createdAt: row.created_at || new Date().toISOString(),
    expiresAt: row.expires_at,
    farmerId: row.farmer_id,
    isRealtimeNew: Boolean(row.isRealtimeNew),
  };
}

export type RealtimeStatus = "connected" | "connecting" | "offline";

interface ListingsContextValue {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  addListing: (l: {
    cropId: string;
    quantity: number;
    unit?: string;
    price: number;
    farmer: string;
    phone: string;
    stateId: string;
    districtId: string;
    placeId?: string;
    placeName: string;
    farmerId?: string;
    status?: ListingStatus;
  }) => Promise<Listing>;
  realtimeStatus: RealtimeStatus;
  isSupabaseReady: boolean;
  latestNewListing: Listing | null;
  newListingAlertCount: number;
  clearLatestListing: () => void;
  refreshListings: () => Promise<void>;
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [dbListings, setDbListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>("connecting");
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean>(false);
  const [latestNewListing, setLatestNewListing] = useState<Listing | null>(null);
  const [newListingAlertCount, setNewListingAlertCount] = useState<number>(0);

  const supabaseChannelRef = useRef<RealtimeChannel | null>(null);

  // Fetch listings from Supabase (shared centralized database)
  const fetchSupabaseListings = useCallback(async () => {
    const supabase = getSupabase();
    const config = getStoredSupabaseConfig();
    setIsSupabaseReady(config.isConfigured);

    if (!supabase || !config.isConfigured) {
      setRealtimeStatus("offline");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Try public_listings view first (which filters active & unexpired)
      let { data, error: queryErr } = await supabase
        .from("public_listings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      // 2. If view does not exist yet, fallback to listings table
      if (queryErr || !data) {
        const fallbackRes = await supabase
          .from("listings")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(100);

        if (!fallbackRes.error && fallbackRes.data) {
          data = fallbackRes.data;
          queryErr = null;
        } else if (fallbackRes.error) {
          // 3. Fallback for older schema without status column
          const legacyRes = await supabase
            .from("listings")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);

          if (!legacyRes.error && legacyRes.data) {
            data = legacyRes.data;
            queryErr = null;
          } else {
            queryErr = fallbackRes.error;
          }
        }
      }

      if (queryErr) {
        console.warn("[Supabase listings query error]:", queryErr.message);
        setError(queryErr.message);
        setRealtimeStatus("offline");
      } else if (data) {
        const mapped = data.map((d: Record<string, unknown>) => mapDbToListing(d));
        setDbListings(mapped);
        setError(null);
        setRealtimeStatus("connected");
      }
    } catch (err: unknown) {
      console.warn("Failed to fetch listings from Supabase:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
      setRealtimeStatus("offline");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up Realtime subscription + 15s fallback polling + tab focus refetch
  useEffect(() => {
    fetchSupabaseListings();

    const supabase = getSupabase();
    const config = getStoredSupabaseConfig();

    if (!supabase || !config.isConfigured) return;

    try {
      const channel = supabase
        .channel("realtime-shared-listings")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "listings" },
          (payload) => {
            const newRow = payload.new;
            if (newRow && (!newRow.status || newRow.status === "active")) {
              const newListing = mapDbToListing({
                ...newRow,
                isRealtimeNew: true,
              });
              setDbListings((prev) => {
                if (prev.some((x) => x.id === newListing.id)) return prev;
                return [newListing, ...prev];
              });
              setLatestNewListing(newListing);
              setNewListingAlertCount((c) => c + 1);
            }
          },
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "listings" },
          (payload) => {
            const updatedRow = payload.new;
            if (updatedRow) {
              const updated = mapDbToListing(updatedRow);
              setDbListings((prev) =>
                prev.map((item) => (item.id === updated.id ? updated : item)),
              );
            }
          },
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "listings" },
          (payload) => {
            const deletedId = String(payload.old?.id);
            setDbListings((prev) => prev.filter((x) => x.id !== deletedId));
          },
        )
        .on("broadcast", { event: "new_listing" }, ({ payload }) => {
          if (payload) {
            const newListing = mapDbToListing({
              ...payload,
              isRealtimeNew: true,
            });
            setDbListings((prev) => {
              if (prev.some((x) => x.id === newListing.id)) return prev;
              return [newListing, ...prev];
            });
            setLatestNewListing(newListing);
            setNewListingAlertCount((c) => c + 1);
          }
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setRealtimeStatus("connected");
          } else if (status === "CHANNEL_ERROR") {
            setRealtimeStatus("offline");
          }
        });

      supabaseChannelRef.current = channel;

      // Fallback Polling every 15 seconds to ensure fresh data across devices
      const pollInterval = window.setInterval(() => {
        fetchSupabaseListings();
      }, 15000);

      // Refetch when tab regains focus or visibility
      const handleFocus = () => {
        fetchSupabaseListings();
      };
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchSupabaseListings();
        }
      };

      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.clearInterval(pollInterval);
        window.removeEventListener("focus", handleFocus);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Error subscribing to Supabase Realtime:", err);
    }
  }, [fetchSupabaseListings]);

  // addListing: persists into shared Supabase database and broadcasts across all devices
  const addListing = useCallback(
    async (l: {
      cropId: string;
      quantity: number;
      unit?: string;
      price: number;
      farmer: string;
      phone: string;
      stateId: string;
      districtId: string;
      placeId?: string;
      placeName: string;
      farmerId?: string;
      status?: ListingStatus;
    }): Promise<Listing> => {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error(
          "Supabase database connection is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
        );
      }

      // 1. Primary insert payload according to standard schema
      const standardPayload: Record<string, unknown> = {
        crop: l.cropId,
        state: l.stateId,
        district: l.districtId,
        mandi: l.placeName,
        quantity: Number(l.quantity) || 1,
        unit: l.unit || "quintal",
        ask_price: Number(l.price) || 0,
        farmer_name: l.farmer,
        phone: l.phone,
        status: l.status || "active",
      };

      if (l.farmerId) {
        standardPayload.farmer_id = l.farmerId;
      }

      let insertResult = await supabase.from("listings").insert(standardPayload).select().single();

      // 2. If new columns don't exist yet (migration pending), fallback to legacy column names
      if (insertResult.error && insertResult.error.message?.includes("column")) {
        console.warn(
          "Column mismatch on standard insert, attempting legacy schema insert:",
          insertResult.error.message,
        );
        const legacyPayload = {
          crop_id: l.cropId,
          state_id: l.stateId,
          district_id: l.districtId,
          place_id: l.placeId || l.districtId,
          place_name: l.placeName,
          quantity: Number(l.quantity) || 1,
          price: Number(l.price) || 0,
          farmer: l.farmer,
          phone: l.phone,
        };

        insertResult = await supabase.from("listings").insert(legacyPayload).select().single();
      }

      if (insertResult.error) {
        console.error("[Supabase Insert Error]:", insertResult.error);
        throw new Error(insertResult.error.message || "Failed to post listing to database.");
      }

      const savedListing = mapDbToListing({
        ...insertResult.data,
        isRealtimeNew: true,
      });

      // Update local state immediately so publisher sees their listing instantly
      setDbListings((prev) => [savedListing, ...prev.filter((x) => x.id !== savedListing.id)]);
      setLatestNewListing(savedListing);
      setNewListingAlertCount((c) => c + 1);

      // Broadcast to all active devices listening via Supabase Realtime
      if (supabaseChannelRef.current) {
        try {
          supabaseChannelRef.current.send({
            type: "broadcast",
            event: "new_listing",
            payload: insertResult.data,
          });
        } catch {
          /* ignore broadcast send errors */
        }
      }

      return savedListing;
    },
    [],
  );

  const clearLatestListing = useCallback(() => {
    setLatestNewListing(null);
  }, []);

  const value = useMemo<ListingsContextValue>(
    () => ({
      listings: dbListings,
      isLoading,
      error,
      addListing,
      realtimeStatus,
      isSupabaseReady,
      latestNewListing,
      newListingAlertCount,
      clearLatestListing,
      refreshListings: fetchSupabaseListings,
    }),
    [
      dbListings,
      isLoading,
      error,
      addListing,
      realtimeStatus,
      isSupabaseReady,
      latestNewListing,
      newListingAlertCount,
      clearLatestListing,
      fetchSupabaseListings,
    ],
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used inside ListingsProvider");
  return ctx;
}
