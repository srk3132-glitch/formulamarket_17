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

export { getCropImage };

export type Listing = {
  id: string;
  cropId: string;
  quantity: number;
  price: number;
  farmer: string;
  phone: string;
  stateId: string;
  districtId: string;
  placeId: string;
  placeName: string;
  distanceKm: number;
  createdAt?: string;
  isRealtimeNew?: boolean;
};

// Database row mapping helper
export function mapDbToListing(row: Record<string, any>): Listing {
  return {
    id: String(row.id || `lst_${Date.now()}`),
    cropId: String(row.crop_id || row.cropId || "tomato"),
    quantity: Number(row.quantity) || 1,
    price: Number(row.price) || 0,
    farmer: String(row.farmer || "Farmer"),
    phone: String(row.phone || "+91"),
    stateId: String(row.state_id || row.stateId || "tn"),
    districtId: String(row.district_id || row.districtId || ""),
    placeId: String(row.place_id || row.placeId || ""),
    placeName: String(row.place_name || row.placeName || ""),
    distanceKm: Number(row.distance_km ?? row.distanceKm ?? 5),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

export function mapListingToDb(l: Omit<Listing, "id" | "distanceKm">) {
  return {
    id: `lst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    crop_id: l.cropId,
    quantity: l.quantity,
    price: l.price,
    farmer: l.farmer,
    phone: l.phone,
    state_id: l.stateId,
    district_id: l.districtId,
    place_id: l.placeId,
    place_name: l.placeName,
    distance_km: Math.round(1 + Math.random() * 9),
    created_at: new Date().toISOString(),
  };
}

export const SEED: Listing[] = [
  {
    id: "l1",
    cropId: "tomato",
    quantity: 1,
    price: 2140,
    farmer: "Ravi Farms",
    phone: "+91 98400 11223",
    stateId: "tn",
    districtId: "coimbatore",
    placeId: "kurumbapakkam",
    placeName: "Kurumbapakkam",
    distanceKm: 2,
  },
  {
    id: "l2",
    cropId: "onion",
    quantity: 5,
    price: 1480,
    farmer: "Sulochana Co-op",
    phone: "+91 94430 55110",
    stateId: "tn",
    districtId: "madurai",
    placeId: "usilampatti",
    placeName: "Usilampatti Market Yard",
    distanceKm: 34,
  },
  {
    id: "l3",
    cropId: "chilli",
    quantity: 2,
    price: 14600,
    farmer: "Prakash Gardens",
    phone: "+91 90030 77441",
    stateId: "ap",
    districtId: "guntur",
    placeId: "guntur-market",
    placeName: "Guntur Mirchi Yard (Asia's Largest)",
    distanceKm: 58,
  },
  {
    id: "l4",
    cropId: "turmeric",
    quantity: 12,
    price: 8100,
    farmer: "Anjaneyulu N.",
    phone: "+91 99590 22087",
    stateId: "ts",
    districtId: "nizamabad",
    placeId: "nizamabad-yard",
    placeName: "Nizamabad APMC Turmeric Yard",
    distanceKm: 11,
  },
  {
    id: "l5",
    cropId: "pepper",
    quantity: 1,
    price: 57500,
    farmer: "Maravoor Estate",
    phone: "+91 97440 31298",
    stateId: "kl",
    districtId: "kottayam",
    placeId: "maravoor",
    placeName: "Maravoor Estate Yard",
    distanceKm: 7,
  },
  {
    id: "l6",
    cropId: "rice",
    quantity: 30,
    price: 4290,
    farmer: "Attur Farmer Group",
    phone: "+91 93450 66120",
    stateId: "tn",
    districtId: "salem",
    placeId: "attur",
    placeName: "Attur Sago & Tapioca Mandi",
    distanceKm: 21,
  },
  {
    id: "l7",
    cropId: "banana",
    quantity: 15,
    price: 1820,
    farmer: "Kaveri River Orchards",
    phone: "+91 98421 33445",
    stateId: "tn",
    districtId: "coimbatore",
    placeId: "pollachi",
    placeName: "Pollachi Coconut & Veg Mandi",
    distanceKm: 8,
  },
  {
    id: "l8",
    cropId: "mango",
    quantity: 25,
    price: 4400,
    farmer: "Sri Balaji Mango Grove",
    phone: "+91 99402 77112",
    stateId: "ap",
    districtId: "chittoor",
    placeId: "chittoor-market",
    placeName: "Chittoor Mango & Jaggery Market",
    distanceKm: 42,
  },
  {
    id: "l9",
    cropId: "tomato",
    quantity: 18,
    price: 2180,
    farmer: "Madanapalle Red Gold Producers",
    phone: "+91 99890 55432",
    stateId: "ap",
    districtId: "chittoor",
    placeId: "madanapalle",
    placeName: "Madanapalle Tomato Mandi",
    distanceKm: 15,
  },
  {
    id: "l10",
    cropId: "carrot",
    quantity: 12,
    price: 3050,
    farmer: "Ooty Valley Greens",
    phone: "+91 98403 44556",
    stateId: "tn",
    districtId: "nilgiris",
    placeId: "ooty",
    placeName: "Udhagamandalam (Ooty) Vegetable Yard",
    distanceKm: 14,
  },
  {
    id: "l11",
    cropId: "pomegranate",
    quantity: 8,
    price: 9400,
    farmer: "Deccan Fruit Producers",
    phone: "+91 98850 66778",
    stateId: "ts",
    districtId: "rangareddy",
    placeId: "bowenpally",
    placeName: "Bowenpally Wholesale Veg Mandi",
    distanceKm: 32,
  },
  {
    id: "l12",
    cropId: "pineapple",
    quantity: 20,
    price: 3150,
    farmer: "Vazhakulam Pineapple Growers",
    phone: "+91 94470 88211",
    stateId: "kl",
    districtId: "ernakulam",
    placeId: "muvattupuzha",
    placeName: "Muvattupuzha Vazhakulam Pineapple Market",
    distanceKm: 18,
  },
  {
    id: "l13",
    cropId: "cotton",
    quantity: 35,
    price: 7100,
    farmer: "Enumamula Cotton Rythu Sangham",
    phone: "+91 98490 33412",
    stateId: "ts",
    districtId: "warangal",
    placeId: "enumamula",
    placeName: "Enumamula Market Yard",
    distanceKm: 9,
  },
  {
    id: "l14",
    cropId: "pepper",
    quantity: 4,
    price: 58200,
    farmer: "Wayanad Highland Spice Estate",
    phone: "+91 97451 22904",
    stateId: "kl",
    districtId: "wayanad",
    placeId: "sulthan-bathery",
    placeName: "Sulthan Bathery Coffee & Pepper Yard",
    distanceKm: 25,
  },
];

type RealtimeStatus = "connected" | "connecting" | "offline" | "ready";

type ListingsContextValue = {
  listings: Listing[];
  addListing: (l: Omit<Listing, "id" | "distanceKm">) => Promise<Listing>;
  realtimeStatus: RealtimeStatus;
  isSupabaseReady: boolean;
  latestNewListing: Listing | null;
  newListingAlertCount: number;
  clearLatestListing: () => void;
  refreshListings: () => Promise<void>;
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [dbListings, setDbListings] = useState<Listing[]>([]);
  const [localAdded, setLocalAdded] = useState<Listing[]>([]);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>("connecting");
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean>(false);
  const [latestNewListing, setLatestNewListing] = useState<Listing | null>(null);
  const [newListingAlertCount, setNewListingAlertCount] = useState<number>(0);

  const localBroadcastRef = useRef<BroadcastChannel | null>(null);
  const supabaseChannelRef = useRef<any>(null);

  // Load offline / cached listings from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("kb-listings");
      if (raw) {
        setLocalAdded(JSON.parse(raw) as Listing[]);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Multi-tab real-time sync via BroadcastChannel (works instantly across all local tabs)
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    try {
      const bc = new BroadcastChannel("fm_realtime_listings");
      localBroadcastRef.current = bc;

      bc.onmessage = (event) => {
        const { type, listing } = event.data || {};
        if (type === "NEW_LISTING" && listing) {
          const item: Listing = { ...listing, isRealtimeNew: true };
          setDbListings((prev) => {
            if (prev.some((x) => x.id === item.id)) return prev;
            return [item, ...prev];
          });
          setLatestNewListing(item);
          setNewListingAlertCount((c) => c + 1);
        }
      };

      return () => {
        bc.close();
      };
    } catch (err) {
      console.warn("BroadcastChannel not supported", err);
    }
  }, []);

  // Fetch from Supabase and subscribe to Realtime postgres_changes
  const fetchSupabaseListings = useCallback(async () => {
    const supabase = getSupabase();
    const config = getStoredSupabaseConfig();
    setIsSupabaseReady(config.isConfigured);

    if (!supabase || !config.isConfigured) {
      setRealtimeStatus("offline");
      return;
    }

    try {
      setRealtimeStatus("connecting");
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.warn("Supabase listings query notice:", error.message);
        setRealtimeStatus("offline");
      } else if (data && data.length > 0) {
        const mapped = data.map((d: any) => mapDbToListing(d));
        setDbListings(mapped);
        setRealtimeStatus("connected");
      } else {
        setRealtimeStatus("connected");
      }
    } catch (err) {
      console.warn("Failed to fetch listings from Supabase:", err);
      setRealtimeStatus("offline");
    }
  }, []);

  useEffect(() => {
    fetchSupabaseListings();

    const supabase = getSupabase();
    const config = getStoredSupabaseConfig();

    if (!supabase || !config.isConfigured) return;

    try {
      const channel = supabase
        .channel("realtime-listings-feed")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "listings" },
          (payload) => {
            const newListing: Listing = {
              ...mapDbToListing(payload.new),
              isRealtimeNew: true,
            };
            setDbListings((prev) => {
              if (prev.some((x) => x.id === newListing.id)) return prev;
              return [newListing, ...prev];
            });
            setLatestNewListing(newListing);
            setNewListingAlertCount((c) => c + 1);
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
            const newListing: Listing = {
              ...mapDbToListing(payload),
              isRealtimeNew: true,
            };
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

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Error subscribing to Supabase Realtime:", err);
    }
  }, [fetchSupabaseListings]);

  // addListing: farmer lists a harvest -> stored in DB + broadcasted in real time to buyers!
  const addListing = useCallback(
    async (l: Omit<Listing, "id" | "distanceKm">): Promise<Listing> => {
      const distanceKm = Math.round(1 + Math.random() * 9);
      const tempId = `lst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const newListing: Listing = {
        ...l,
        id: tempId,
        distanceKm,
        createdAt: new Date().toISOString(),
        isRealtimeNew: true,
      };

      // 1. Optimistic update in local state for instantaneous feedback
      setLocalAdded((prev) => {
        const next = [newListing, ...prev];
        if (typeof window !== "undefined") {
          window.localStorage.setItem("kb-listings", JSON.stringify(next));
        }
        return next;
      });

      // 2. Broadcast via local BroadcastChannel (cross-tab real-time in milliseconds)
      if (localBroadcastRef.current) {
        try {
          localBroadcastRef.current.postMessage({
            type: "NEW_LISTING",
            listing: newListing,
          });
        } catch {
          /* ignore */
        }
      }

      // 3. Persist to Supabase and broadcast over Supabase Realtime channel
      const supabase = getSupabase();
      if (supabase) {
        const dbPayload = mapListingToDb(l);
        try {
          const { data, error } = await supabase
            .from("listings")
            .insert(dbPayload)
            .select()
            .single();

          if (error) {
            console.warn("Supabase insert notice (fallback to local state):", error.message);
          } else if (data) {
            const savedItem = mapDbToListing(data);
            setDbListings((prev) => [savedItem, ...prev.filter((x) => x.id !== tempId)]);
          }

          // Also broadcast through channel so subscribed clients receive it instantly
          if (supabaseChannelRef.current) {
            supabaseChannelRef.current.send({
              type: "broadcast",
              event: "new_listing",
              payload: dbPayload,
            });
          }
        } catch (err) {
          console.warn("Failed to insert into Supabase listings:", err);
        }
      }

      return newListing;
    },
    [],
  );

  const clearLatestListing = useCallback(() => {
    setLatestNewListing(null);
  }, []);

  // Combined list: DB listings + newly added local listings + initial seed listings
  const listings = useMemo<Listing[]>(() => {
    const seen = new Set<string>();
    const result: Listing[] = [];

    // Prioritize freshly added items
    for (const item of localAdded) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }

    // Next DB listings
    for (const item of dbListings) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }

    // Next SEED fallback
    for (const item of SEED) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }

    return result;
  }, [localAdded, dbListings]);

  const value = useMemo<ListingsContextValue>(
    () => ({
      listings,
      addListing,
      realtimeStatus,
      isSupabaseReady,
      latestNewListing,
      newListingAlertCount,
      clearLatestListing,
      refreshListings: fetchSupabaseListings,
    }),
    [
      listings,
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
