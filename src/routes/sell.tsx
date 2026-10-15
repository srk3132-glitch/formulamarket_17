import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { ListingCard } from "@/components/ListingCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { CROPS, cropName, type CropItem } from "@/lib/i18n";
import { useRegion, STATES } from "@/lib/region-store";
import { findDistrict, findState, type Lang } from "@/lib/regions";
import { useListings, type Listing } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import { buildPrices, formatRupees, type PriceRow } from "@/lib/prices";
import { getCropImage } from "@/lib/crop-images";
import { getSupabase } from "@/lib/supabase";
import { InterfaceModeNav } from "@/components/InterfaceModeNav";
import {
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  MapPin,
  Camera,
  X,
  Calendar,
  Award,
  Leaf,
  Phone,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  Search,
  Check,
  ArrowRight,
  RotateCcw,
  Store,
  Sparkles,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "List Your Harvest — Formula Market" },
      {
        name: "description",
        content:
          "Farmers: choose your state, district and mandi, set your price against today's live rate, and sell directly to verified buyers with 0% commission.",
      },
      { property: "og:title", content: "List Your Harvest — Formula Market" },
      {
        property: "og:description",
        content:
          "Post your harvest lot directly to verified buyers across India with 0% commission.",
      },
    ],
  }),
  headers: () => ({
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  }),
  component: SellPage,
});

// Canvas-based client-side image compression to < 500KB JPEG
async function compressHarvestPhoto(file: File): Promise<{ file: File; previewUrl: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDimension = 1400;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({ file, previewUrl: URL.createObjectURL(file) });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const tryQuality = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve({ file, previewUrl: URL.createObjectURL(file) });
                return;
              }
              if (blob.size > 500 * 1024 && q > 0.4) {
                tryQuality(q - 0.15);
              } else {
                const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve({
                  file: compressed,
                  previewUrl: URL.createObjectURL(blob),
                });
              }
            },
            "image/jpeg",
            q,
          );
        };

        tryQuality(0.82);
      };
      img.onerror = () => resolve({ file, previewUrl: URL.createObjectURL(file) });
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ file, previewUrl: URL.createObjectURL(file) });
    reader.readAsDataURL(file);
  });
}

// Major mandi hubs for instant offline nearest-distance geolocation
const REGIONAL_HUBS = [
  { stateId: "tn", districtId: "coimbatore", placeId: "kurumbapakkam", lat: 11.0168, lng: 76.9558 },
  { stateId: "tn", districtId: "chennai", placeId: "koyambedu", lat: 13.0827, lng: 80.2707 },
  { stateId: "tn", districtId: "madurai", placeId: "usilampatti", lat: 9.9252, lng: 78.1198 },
  { stateId: "ap", districtId: "guntur", placeId: "guntur-market", lat: 16.3067, lng: 80.4365 },
  { stateId: "ap", districtId: "chittoor", placeId: "chittoor-market", lat: 13.2172, lng: 79.1003 },
  { stateId: "ts", districtId: "nizamabad", placeId: "nizamabad-yard", lat: 18.6725, lng: 78.0941 },
  { stateId: "ts", districtId: "warangal", placeId: "enumamula", lat: 17.9689, lng: 79.5941 },
  { stateId: "kl", districtId: "wayanad", placeId: "sulthan-bathery", lat: 11.6627, lng: 76.257 },
  { stateId: "kl", districtId: "kottayam", placeId: "maravoor", lat: 9.5916, lng: 76.5222 },
  { stateId: "ka", districtId: "bangalore-urban", placeId: "yeshwanthpur", lat: 12.9716, lng: 77.5946 },
  { stateId: "mh", districtId: "pune", placeId: "gultekdi", lat: 18.5204, lng: 73.8567 },
  { stateId: "dl", districtId: "north-delhi", placeId: "azadpur", lat: 28.7041, lng: 77.1025 },
];

function SellPage() {
  const { t, lang } = useTranslation();
  const { region: globalRegion, setRegion: setGlobalRegion } = useRegion();
  const { listings, addListing } = useListings();
  const { user, isAuthenticated, loginAsSeller } = useAuth();

  // Cascading Location Select State
  const [selectedStateId, setSelectedStateId] = useState<string>(globalRegion.stateId || "tn");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(
    globalRegion.districtId || "coimbatore",
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(
    globalRegion.placeId || "kurumbapakkam",
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Form UX State
  const [cropId, setCropId] = useState<string>("tomato");
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);
  const [cropSearch, setCropSearch] = useState("");
  const cropDropdownRef = useRef<HTMLDivElement>(null);

  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<"quintal" | "kg" | "tonne">("quintal");
  const [price, setPrice] = useState<string>(() => {
    const initRef = buildPrices(globalRegion.placeId || "kurumbapakkam", 0).find(
      (r) => r.cropId === "tomato",
    );
    return initRef?.modal ? String(initRef.modal) : "";
  });

  const [farmer, setFarmer] = useState(user?.role === "seller" ? user.name : "");
  const [phoneDigits, setPhoneDigits] = useState(
    user?.role === "seller" ? user.phone.replace(/[^\d]/g, "").slice(-10) : "",
  );
  const [hasWhatsapp, setHasWhatsapp] = useState(true);

  // Optional Fields
  const [availableFrom, setAvailableFrom] = useState("");
  const [qualityGrade, setQualityGrade] = useState<"A" | "B" | "C" | "">("");
  const [isOrganic, setIsOrganic] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; previewUrl: string }[]>([]);
  const [isCompressingPhotos, setIsCompressingPhotos] = useState(false);

  // Submission, Auth & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedListing, setConfirmedListing] = useState<Listing | null>(null);

  // In-Page Phone OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Validation State
  const [touched, setTouched] = useState<{
    price?: boolean;
    quantity?: boolean;
    farmer?: boolean;
    phone?: boolean;
  }>({});

  const stateObj = useMemo(() => findState(selectedStateId), [selectedStateId]);
  const districtObj = useMemo(
    () => findDistrict(selectedStateId, selectedDistrictId),
    [selectedStateId, selectedDistrictId],
  );
  const placeObj = useMemo(() => {
    return districtObj.places.find((p) => p.id === selectedPlaceId) || districtObj.places[0]!;
  }, [districtObj, selectedPlaceId]);

  // Sync with global auth user
  useEffect(() => {
    if (user?.role === "seller") {
      setFarmer((prev) => prev || user.name);
      setPhoneDigits((prev) => prev || user.phone.replace(/[^\d]/g, "").slice(-10));
    }
  }, [user]);

  // Close crop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cropDropdownRef.current && !cropDropdownRef.current.contains(event.target as Node)) {
        setIsCropDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Today's benchmark rate for selected mandi & crop
  const reference = useMemo(() => {
    const list = buildPrices(placeObj.id, 0);
    return list.find((r) => r.cropId === cropId);
  }, [placeObj.id, cropId]);

  // Keep ask price pre-filled with the current benchmark until user customizes it
  useEffect(() => {
    if (reference?.modal && !touched.price) {
      setPrice(String(reference.modal));
    }
  }, [reference?.modal, touched.price]);

  // Price comparison calculation
  const priceComparison = useMemo(() => {
    if (!price || !reference?.modal) return null;
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) return null;

    let normalizedPrice = numPrice;
    if (unit === "kg") normalizedPrice = numPrice * 100;
    if (unit === "tonne") normalizedPrice = numPrice / 10;

    const diffPct = Math.round(((normalizedPrice - reference.modal) / reference.modal) * 100);
    const isWithinTen = Math.abs(diffPct) <= 10;

    return {
      diffPct,
      isWithinTen,
      isAbove: diffPct > 0,
      isMatching: diffPct === 0,
    };
  }, [price, reference, unit]);

  // Group crops into Categories
  const groupedCrops = useMemo(() => {
    const search = cropSearch.toLowerCase().trim();
    const filterFn = (c: CropItem) => {
      if (!search) return true;
      const localized = cropName(c.id, lang).toLowerCase();
      const english = c.en.toLowerCase();
      return localized.includes(search) || english.includes(search);
    };

    return {
      vegetables: CROPS.filter((c) => c.category === "vegetable" && filterFn(c)),
      fruits: CROPS.filter((c) => c.category === "fruit" && filterFn(c)),
      grains: CROPS.filter((c) => c.category === "grain_spice" && filterFn(c)),
    };
  }, [cropSearch, lang]);

  // Intelligent Voice Transcript Assistant
  const handleVoiceTranscript = (transcript: string) => {
    const lower = transcript.toLowerCase();

    // Check if spoken words match a crop
    const matchedCrop = CROPS.find((c) => {
      const loc = cropName(c.id, lang).toLowerCase();
      const enName = c.en.toLowerCase();
      return lower.includes(loc) || lower.includes(enName) || lower.includes(c.id);
    });

    if (matchedCrop) {
      setCropId(matchedCrop.id);
      toast.success(`🌾 Voice selected crop: ${cropName(matchedCrop.id, lang)}`);
      return;
    }

    // Check if spoken words contain numbers for quantity
    const numbersMatch = transcript.match(/\d+(\.\d+)?/);
    if (numbersMatch && !quantity) {
      setQuantity(numbersMatch[0]);
      toast.success(`🔢 Voice entered quantity: ${numbersMatch[0]} ${unit}`);
      return;
    }

    // Fallback: fill farmer name if empty
    if (!farmer && transcript.trim().length > 2) {
      setFarmer(transcript.trim());
      toast.success(`👤 Voice entered name: ${transcript.trim()}`);
    }
  };

  // Geolocation Auto-Fill
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t("errGeolocation"));
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        let closest = REGIONAL_HUBS[0]!;
        let minDistance = Infinity;

        for (const hub of REGIONAL_HUBS) {
          const d = Math.hypot(hub.lat - latitude, hub.lng - longitude);
          if (d < minDistance) {
            minDistance = d;
            closest = hub;
          }
        }

        setSelectedStateId(closest.stateId);
        setSelectedDistrictId(closest.districtId);
        setSelectedPlaceId(closest.placeId);
        setGlobalRegion({
          stateId: closest.stateId,
          districtId: closest.districtId,
          placeId: closest.placeId,
        });

        setIsDetectingLocation(false);
        const st = findState(closest.stateId);
        const dt = findDistrict(closest.stateId, closest.districtId);
        toast.success(`📍 ${t("msgMandiAutoFilled")} ${dt.name}, ${st.name}`);
      },
      () => {
        setIsDetectingLocation(false);
        setSelectedStateId("tn");
        setSelectedDistrictId("coimbatore");
        setSelectedPlaceId("kurumbapakkam");
        toast.info(t("msgDefaultHub"));
      },
      { timeout: 6000 },
    );
  };

  const handleStateChange = (newStId: string) => {
    const nextSt = findState(newStId);
    const firstDist = nextSt.districts[0]!;
    const firstPlace = firstDist.places[0]!;
    setSelectedStateId(newStId);
    setSelectedDistrictId(firstDist.id);
    setSelectedPlaceId(firstPlace.id);
    setGlobalRegion({
      stateId: newStId,
      districtId: firstDist.id,
      placeId: firstPlace.id,
    });
  };

  const handleDistrictChange = (newDistId: string) => {
    const nextDist = findDistrict(selectedStateId, newDistId);
    const firstPlace = nextDist.places[0]!;
    setSelectedDistrictId(newDistId);
    setSelectedPlaceId(firstPlace.id);
    setGlobalRegion({
      stateId: selectedStateId,
      districtId: newDistId,
      placeId: firstPlace.id,
    });
  };

  // Photo Upload Handler with Client Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 3) {
      toast.error(t("errMaxPhotos"));
      return;
    }

    setIsCompressingPhotos(true);
    try {
      const compressedList = await Promise.all(
        Array.from(files).map((f) => compressHarvestPhoto(f)),
      );
      setPhotos((prev) => [...prev, ...compressedList].slice(0, 3));
      toast.success(t("msgPhotosOptimized"));
    } catch {
      toast.error(t("errProcessingPhotos"));
    } finally {
      setIsCompressingPhotos(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Validation
  const phoneValid = /^[6-9]\d{9}$/.test(phoneDigits.trim());
  const quantityValid = Number(quantity) > 0;
  const priceValid = !isNaN(Number(price)) && Number(price) > 0;
  const farmerValid = farmer.trim().length >= 2;
  const isFormValid = phoneValid && quantityValid && priceValid && farmerValid;

  // Execute Post to Shared Database
  const executePostListing = async (authenticatedPhone?: string) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const fullPhone = authenticatedPhone || `+91 ${phoneDigits.trim()}`;

    try {
      const supabase = getSupabase();
      if (supabase && photos.length > 0) {
        try {
          for (let i = 0; i < photos.length; i++) {
            const photoItem = photos[i];
            if (photoItem) {
              const fileName = `harvest_${Date.now()}_${i}.jpg`;
              await supabase.storage.from("harvests").upload(fileName, photoItem.file, {
                cacheControl: "3600",
                upsert: true,
              });
            }
          }
        } catch {
          // Storage upload is progressive enhancement
        }
      }

      const created = await addListing({
        cropId,
        quantity: Number(quantity),
        unit,
        price: Number(price),
        farmer: farmer.trim(),
        phone: fullPhone,
        stateId: selectedStateId,
        districtId: selectedDistrictId,
        placeId: selectedPlaceId,
        placeName: placeObj.name,
        status: "active",
        ...(user?.id ? { farmerId: user.id } : {}),
      });


      setConfirmedListing(created);
      toast.success("🌾 Harvest published live! Synced across all buyer devices in real-time.", {
        duration: 5000,
      });
    } catch (err: unknown) {
      console.error("Failed to post harvest:", err);
      const msg = err instanceof Error ? err.message : "Failed to post listing to database.";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ quantity: true, price: true, farmer: true, phone: true });

    if (!isFormValid) {
      toast.error(t("errFormFill"));
      return;
    }

    if (!isAuthenticated) {
      setOtpValue("1234");
      setShowOtpModal(true);
      return;
    }

    await executePostListing();
  };

  const handleVerifyOtp = async () => {
    if (otpValue.trim() !== "1234" && otpValue.trim().length < 4) {
      setOtpError(t("errInvalidOtp"));
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const fullPhone = `+91 ${phoneDigits.trim()}`;
      loginAsSeller({
        name: farmer.trim() || "Kisan Sathi",
        phone: fullPhone,
        farmName: `${farmer.trim() || "Farmer"}'s Harvest`,
        stateId: selectedStateId,
        districtId: selectedDistrictId,
        placeName: placeObj.name,
      });

      setShowOtpModal(false);
      toast.success(t("msgPhoneVerified"));
      await executePostListing(fullPhone);
    } catch {
      setOtpError("Verification error. Please retry.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePostAnother = () => {
    setConfirmedListing(null);
    setQuantity("");
    setPrice(reference?.modal ? String(reference.modal) : "");
    setPhotos([]);
    setQualityGrade("");
    setAvailableFrom("");
    setTouched({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedCropInfo = CROPS.find((c) => c.id === cropId);
  const selectedCropImage = getCropImage(cropId);

  // My listings from database
  const myListings = useMemo(() => {
    return listings.filter(
      (l) =>
        (farmer && l.farmer.toLowerCase() === farmer.toLowerCase()) ||
        (phoneDigits && l.phone.includes(phoneDigits.trim())) ||
        (user?.id && l.farmerId === user.id),
    );
  }, [listings, farmer, phoneDigits, user?.id]);

  // Live draft preview object representing what the farmer is currently creating
  const draftListingPreview: Listing = useMemo(
    () => ({
      id: "draft-preview",
      cropId,
      quantity: Number(quantity) || 10,
      unit,
      price: Number(price) || (reference?.modal ? reference.modal : 2000),
      farmer: farmer.trim() || "Your Farm Lot",
      phone: phoneDigits ? `+91 ${phoneDigits}` : "+91 98400 11223",
      stateId: selectedStateId,
      districtId: selectedDistrictId,
      placeId: selectedPlaceId,
      placeName: placeObj.name,
      farmerId: user?.id,
      status: "active",
      createdAt: new Date().toISOString(),
    }),
    [
      cropId,
      quantity,
      unit,
      price,
      reference?.modal,
      farmer,
      phoneDigits,
      selectedStateId,
      selectedDistrictId,
      selectedPlaceId,
      placeObj.name,
      user?.id,
    ],
  );

  return (
<<<<<<< HEAD
    <main className="relative z-10 mx-auto max-w-[1200px] w-full px-4 sm:px-6 lg:px-8 pb-24 pt-6">
      {/* TASK 2: CENTERED PROMINENT 26 LANGUAGES SELECTOR AT TOP */}
      <LanguageSelector onVoiceTranscript={handleVoiceTranscript} className="mb-8" />

=======
    <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-20 pt-6">
      <div className="hidden md:block mb-6">
        <InterfaceModeNav currentMode="sell" />
      </div>
>>>>>>> 0d43f03ed679adadd3c4a4000a3093cda96c9fcb
      {/* SUCCESS CONFIRMATION STATE */}
      {confirmedListing ? (
        <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-white/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
          <div className="text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner">
              <CheckCircle2 className="size-9 text-emerald-600" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
              {t("harvestSuccessTitle")}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-emerald-900/75 max-w-md mx-auto leading-relaxed">
              {t("harvestSuccessSub")}
            </p>
          </div>

          {/* Harvest Summary Card */}
          <div className="mt-6 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCropImage.emoji}</span>
                <div>
                  <h3 className="font-bold text-emerald-950 text-lg">
                    {cropName(confirmedListing.cropId, lang)}
                  </h3>
                  <p className="text-xs text-emerald-900/70">
                    {confirmedListing.quantity} {confirmedListing.unit || "quintals"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-bold text-emerald-800">
                  {formatRupees(confirmedListing.price)}
                </span>
                <span className="block text-xs text-emerald-900/60">
                  /{confirmedListing.unit || "quintal"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-emerald-950/80 pt-1">
              <div>
                <span className="block text-[11px] uppercase font-bold text-emerald-900/60">
                  {t("mandiMarket")}
                </span>
                <span className="font-semibold">{confirmedListing.placeName}</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase font-bold text-emerald-900/60">
                  {t("farmerContact")}
                </span>
                <span className="font-semibold">{confirmedListing.phone}</span>
              </div>
            </div>

            {(qualityGrade || isOrganic || availableFrom) && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-900/10">
                {qualityGrade && (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    Grade {qualityGrade}
                  </span>
                )}
                {isOrganic && (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Leaf className="size-3.5" />
                    {t("organicCertified")}
                  </span>
                )}
                {availableFrom && (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    From: {availableFrom}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={handlePostAnother}
              className="flex-1 rounded-xl border border-emerald-600/30 bg-white py-3.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="size-4" />
              <span>{t("postAnother")}</span>
            </button>
            <Link
              to="/buy"
              className="flex-1 rounded-xl bg-brand py-3.5 text-sm font-semibold text-white shadow-md hover:bg-brand/90 transition flex items-center justify-center gap-2"
            >
              <span>{t("viewBuyerFeed")}</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      ) : (
        /* TASK 1: RESPONSIVE 2-COLUMN FORM ON LAPTOP/DESKTOP (>=1024px), CLEAN MOBILE FLOW (<1024px) */
        <div className="space-y-10">
          <section className="rounded-3xl border border-white/60 bg-white/50 p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
            {/* Header Header & Trust Badges */}
            <div className="border-b border-brand-deep/10 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs sm:text-sm font-semibold text-emerald-800">
                  <Sprout className="size-4 text-emerald-700" />
                  {t("portalBadge")}
                </span>
                <span className="text-xs sm:text-sm text-brand-deep/70">
                  {t("portalTrust")}
                </span>
              </div>
              <h1 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-deep">
                {t("sellTitle")}
              </h1>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-brand-deep/75 max-w-3xl">
                {t("sellSub")}
              </p>

              {/* Authenticated Status indicator */}
              {isAuthenticated && user?.role === "seller" ? (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-600/20 bg-emerald-50/70 p-3 px-4 text-xs sm:text-sm text-emerald-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-700 shrink-0" />
                    <span>
                      {t("verifiedSeller")}{" "}
                      <strong>{user.name}</strong> ({user.phone})
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* RESPONSIVE 2-COLUMN FORM ON DESKTOP */}
            <form className="mt-8 space-y-8" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 gap-8 items-start">
                {/* ============================================================ */}
                {/* COLUMN 1 (LEFT ON DESKTOP): CROP DETAILS & HARVEST SPECIFICS */}
                {/* ============================================================ */}
                <div className="space-y-6 lg:p-6 lg:rounded-2xl lg:bg-white/40 lg:border lg:border-white/70">
                  <div className="flex items-center justify-between border-b border-brand-deep/10 pb-2.5">
                    <h2 className="font-display font-bold text-base lg:text-lg text-brand-deep flex items-center gap-2">
                      <Sprout className="size-5 text-brand" />
                      <span>{t("cropDetailsHeading")}</span>
                    </h2>
                    <span className="text-xs text-brand-deep/60 uppercase font-semibold tracking-wider">
                      Step 1 of 2
                    </span>
                  </div>

                  {/* 1. SEARCHABLE CROP COMBOBOX */}
                  <div className="relative" ref={cropDropdownRef}>
                    <label className="block">
                      <span className="mb-2 block text-xs lg:text-sm font-semibold text-brand-deep">
                        {t("crop")} <span className="text-red-500">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCropDropdownOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-4 py-3.5 text-sm lg:text-base font-semibold text-ink shadow-2xs transition hover:bg-white focus:border-brand focus:ring-2 focus:ring-brand/30 min-h-[50px]"
                        aria-expanded={isCropDropdownOpen}
                      >
                        <div className="flex items-center gap-3 truncate min-w-0">
                          <span className="text-2xl shrink-0">{selectedCropImage.emoji}</span>
                          <span className="text-brand-deep font-bold truncate text-base">
                            {cropName(cropId, lang)}
                          </span>
                          {selectedCropInfo?.en &&
                            selectedCropInfo.en.trim().toLowerCase() !==
                              cropName(cropId, lang).trim().toLowerCase() && (
                              <span className="text-xs lg:text-sm text-brand-deep/55 truncate hidden sm:inline">
                                ({selectedCropInfo.en})
                              </span>
                            )}
                        </div>
                        <ChevronDown
                          className={`size-4 text-brand-deep/60 transition-transform ${
                            isCropDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </label>

                    {/* Combobox Dropdown Panel */}
                    {isCropDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-84 overflow-y-auto rounded-2xl border border-white/80 bg-white/98 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                        {/* Search box inside combobox */}
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-3 size-4 text-brand-deep/40" />
                          <input
                            type="text"
                            autoFocus
                            placeholder={t("searchCropPlaceholder")}
                            value={cropSearch}
                            onChange={(e) => setCropSearch(e.target.value)}
                            className="w-full rounded-xl border border-brand/25 bg-white py-2.5 pl-9 pr-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                          />
                        </div>

                        <div className="space-y-3">
                          {/* Vegetables */}
                          {groupedCrops.vegetables.length > 0 && (
                            <div>
                              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                🥦 {t("categoryVegetables")} ({groupedCrops.vegetables.length})
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {groupedCrops.vegetables.map((c) => {
                                  const img = getCropImage(c.id);
                                  const isSelected = cropId === c.id;
                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setCropId(c.id);
                                        setIsCropDropdownOpen(false);
                                      }}
                                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs lg:text-sm transition min-h-[44px] ${
                                        isSelected
                                          ? "bg-brand text-white font-bold"
                                          : "hover:bg-brand/10 text-brand-deep"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="text-lg">{img.emoji}</span>
                                        <span className="truncate">{cropName(c.id, lang)}</span>
                                      </div>
                                      {isSelected && <Check className="size-4 shrink-0 ml-1" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Fruits */}
                          {groupedCrops.fruits.length > 0 && (
                            <div>
                              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                                🍎 {t("categoryFruits")} ({groupedCrops.fruits.length})
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {groupedCrops.fruits.map((c) => {
                                  const img = getCropImage(c.id);
                                  const isSelected = cropId === c.id;
                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setCropId(c.id);
                                        setIsCropDropdownOpen(false);
                                      }}
                                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs lg:text-sm transition min-h-[44px] ${
                                        isSelected
                                          ? "bg-brand text-white font-bold"
                                          : "hover:bg-brand/10 text-brand-deep"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="text-lg">{img.emoji}</span>
                                        <span className="truncate">{cropName(c.id, lang)}</span>
                                      </div>
                                      {isSelected && <Check className="size-4 shrink-0 ml-1" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Grains & Spices */}
                          {groupedCrops.grains.length > 0 && (
                            <div>
                              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                                🌾 {t("categoryGrains")} ({groupedCrops.grains.length})
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {groupedCrops.grains.map((c) => {
                                  const img = getCropImage(c.id);
                                  const isSelected = cropId === c.id;
                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setCropId(c.id);
                                        setIsCropDropdownOpen(false);
                                      }}
                                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs lg:text-sm transition min-h-[44px] ${
                                        isSelected
                                          ? "bg-brand text-white font-bold"
                                          : "hover:bg-brand/10 text-brand-deep"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="text-lg">{img.emoji}</span>
                                        <span className="truncate">{cropName(c.id, lang)}</span>
                                      </div>
                                      {isSelected && <Check className="size-4 shrink-0 ml-1" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. QUALITY GRADE */}
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-brand-deep mb-2">
                      {t("qualityGrade")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["A", "B", "C"] as const).map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setQualityGrade(qualityGrade === grade ? "" : grade)}
                          className={`rounded-xl py-2.5 text-xs lg:text-sm font-bold transition min-h-[44px] ${
                            qualityGrade === grade
                              ? "bg-brand text-white shadow-sm ring-1 ring-brand"
                              : "border border-white/80 bg-white/80 text-brand-deep hover:bg-white"
                          }`}
                        >
                          Grade {grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. ORGANIC CERTIFICATION & HARVEST DATE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-brand-deep mb-1.5">
                        {t("availableFrom")}
                      </label>
                      <input
                        type="date"
                        value={availableFrom}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2.5 text-xs lg:text-sm font-medium text-ink outline-none min-h-[44px] focus:border-brand"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <button
                        type="button"
                        onClick={() => setIsOrganic((prev) => !prev)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs lg:text-sm font-bold transition min-h-[44px] ${
                          isOrganic
                            ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800"
                            : "border border-emerald-600/30 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100"
                        }`}
                      >
                        <Leaf className="size-4" />
                        <span>{isOrganic ? t("organicCertified") : t("organicProduce")}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4. HARVEST PHOTOS UPLOAD */}
                  <div className="rounded-2xl border border-white/70 bg-white/50 p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs lg:text-sm font-semibold text-brand-deep">
                        {t("harvestPhotos")}
                      </label>
                      <span className="text-xs text-brand-deep/60 font-medium">
                        {photos.length}/3 {t("uploadedPhotos")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {photos.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border border-emerald-900/20 shadow-xs"
                        >
                          <img
                            src={item.previewUrl}
                            alt="Harvest preview"
                            className="size-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-black/75 text-white hover:bg-red-600 transition"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}

                      {photos.length < 3 && (
                        <label className="flex flex-col items-center justify-center size-20 sm:size-24 rounded-2xl border-2 border-dashed border-brand/30 bg-white/70 hover:bg-white cursor-pointer transition min-h-[44px]">
                          <Camera className="size-6 text-brand/70" />
                          <span className="text-[11px] font-semibold text-brand mt-1">
                            {t("addPhoto")}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={isCompressingPhotos}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* COLUMN 2 (RIGHT ON DESKTOP): PRICE, QUANTITY, LOCATION & SELLER CONTACT */}
                {/* ========================================================================= */}
                <div className="space-y-6 lg:p-6 lg:rounded-2xl lg:bg-white/40 lg:border lg:border-white/70">
                  <div className="flex items-center justify-between border-b border-brand-deep/10 pb-2.5">
                    <h2 className="font-display font-bold text-base lg:text-lg text-brand-deep flex items-center gap-2">
                      <TrendingUp className="size-5 text-brand" />
                      <span>{t("pricingLocationHeading")}</span>
                    </h2>
                    <span className="text-xs text-brand-deep/60 uppercase font-semibold tracking-wider">
                      Step 2 of 2
                    </span>
                  </div>

                  {/* 1. QUANTITY & ASK PRICE ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Quantity Field */}
                    <div className="min-w-0">
                      <label className="block min-w-0">
                        <span className="mb-2 block text-xs lg:text-sm font-semibold text-brand-deep">
                          {t("quantity")} <span className="text-red-500">*</span>
                        </span>
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            inputMode="decimal"
                            className={`min-w-0 flex-1 rounded-xl border bg-white/85 px-3.5 py-3 text-sm lg:text-base font-semibold text-ink outline-none transition min-h-[48px] ${
                              touched.quantity && !quantityValid
                                ? "border-red-400 bg-red-50/50"
                                : "border-white/80 focus:border-brand"
                            }`}
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value);
                              setTouched((p) => ({ ...p, quantity: true }));
                            }}
                            onBlur={() => setTouched((p) => ({ ...p, quantity: true }))}
                            placeholder={t("quantityPlaceholder")}
                            required
                          />
                          <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as "quintal" | "kg" | "tonne")}
                            className="w-[120px] sm:w-[130px] shrink-0 truncate rounded-xl border border-white/80 bg-white/95 px-2.5 py-3 text-xs lg:text-sm font-semibold text-brand-deep outline-none focus:border-brand min-h-[48px]"
                          >
                            <option value="quintal">{t("unitQuintal")}</option>
                            <option value="kg">{t("unitKg")}</option>
                            <option value="tonne">{t("unitTonne")}</option>
                          </select>
                        </div>
                      </label>
                      {touched.quantity && !quantityValid && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          {t("errValidQuantity")}
                        </span>
                      )}
                    </div>

                    {/* Ask Price Field */}
                    <div className="min-w-0">
                      <label className="block min-w-0">
                        <span className="mb-2 block text-xs lg:text-sm font-semibold text-brand-deep">
                          {t("askPrice")} <span className="text-red-500">*</span>
                        </span>
                        <input
                          type="number"
                          min="1"
                          inputMode="numeric"
                          className={`w-full min-w-0 rounded-xl border bg-white/85 px-3.5 py-3 text-sm lg:text-base font-semibold text-ink outline-none transition min-h-[48px] ${
                            touched.price && !priceValid
                              ? "border-red-400 bg-red-50/50"
                              : "border-white/80 focus:border-brand"
                          }`}
                          value={price}
                          onChange={(e) => {
                            setPrice(e.target.value);
                            setTouched((p) => ({ ...p, price: true }));
                          }}
                          onBlur={() => setTouched((p) => ({ ...p, price: true }))}
                          placeholder={reference ? String(reference.modal) : "2150"}
                          required
                        />
                      </label>
                      {touched.price && !priceValid && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          {t("errValidPrice")}
                        </span>
                      )}

                      {/* Live Market Benchmark Hint */}
                      {reference && priceComparison ? (
                        <div
                          className={`mt-1.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition min-w-0 ${
                            priceComparison.isWithinTen
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          <TrendingUp className="size-3.5 shrink-0" />
                          <span className="truncate">
                            {t("todaysMandiRate")} {formatRupees(reference.modal)}/qtl. (
                            {Math.abs(priceComparison.diffPct)}%{" "}
                            {priceComparison.isAbove
                              ? t("rateAboveMarket")
                              : priceComparison.isMatching
                                ? t("rateAtMarket")
                                : t("rateBelowMarket")}
                            )
                          </span>
                        </div>
                      ) : reference ? (
                        <p className="mt-1 text-xs text-brand-deep/60 truncate">
                          {t("mandiBenchmark")} <strong>{formatRupees(reference.modal)}</strong> / quintal
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* 2. EMBEDDED BENCHMARK MANDI RATE CARD */}
                  <RateCardContent
                    reference={reference}
                    placeName={placeObj.name}
                    cropId={cropId}
                    lang={lang}
                  />

                  {/* 3. CASCADING LOCATION SELECTS */}
                  <div className="rounded-2xl border border-white/80 bg-white/70 p-4">
                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-deep/75">
                        {t("whereSelling")}
                      </p>
                      <button
                        type="button"
                        onClick={handleUseMyLocation}
                        disabled={isDetectingLocation}
                        className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-white px-3 py-1 text-xs font-semibold text-brand shadow-2xs hover:bg-brand/10 transition disabled:opacity-50 min-h-[34px]"
                      >
                        {isDetectingLocation ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <MapPin className="size-3.5 text-brand" />
                        )}
                        <span>
                          {isDetectingLocation ? t("detectingLocation") : t("useMyLocation")}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* State Select */}
                      <label className="block min-w-0">
                        <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                          {t("state")} <span className="text-red-500">*</span>
                        </span>
                        <select
                          className="w-full min-w-0 truncate rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 text-xs sm:text-sm font-medium text-ink outline-none focus:border-brand min-h-[44px]"
                          value={selectedStateId}
                          onChange={(e) => handleStateChange(e.target.value)}
                        >
                          {STATES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* District Select */}
                      <label className="block min-w-0">
                        <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                          {t("district")} <span className="text-red-500">*</span>
                        </span>
                        <select
                          className="w-full min-w-0 truncate rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 text-xs sm:text-sm font-medium text-ink outline-none focus:border-brand min-h-[44px]"
                          value={selectedDistrictId}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                        >
                          {stateObj.districts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name.replace(/\*+/g, "").trim()}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* Mandi Select */}
                      <label className="block min-w-0">
                        <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                          {t("place")} <span className="text-red-500">*</span>
                        </span>
                        <select
                          className="w-full min-w-0 truncate rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 text-xs sm:text-sm font-medium text-ink outline-none focus:border-brand min-h-[44px]"
                          value={selectedPlaceId}
                          onChange={(e) => {
                            setSelectedPlaceId(e.target.value);
                            setGlobalRegion({
                              stateId: selectedStateId,
                              districtId: selectedDistrictId,
                              placeId: e.target.value,
                            });
                          }}
                        >
                          {districtObj.places.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* 4. FARMER NAME & PHONE NUMBER */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <label className="block min-w-0">
                        <span className="mb-1.5 block text-xs lg:text-sm font-semibold text-brand-deep">
                          {t("yourName")} <span className="text-red-500">*</span>
                        </span>
                        <input
                          className={`w-full min-w-0 rounded-xl border bg-white/85 px-3.5 py-3 text-sm lg:text-base font-medium text-ink outline-none transition min-h-[48px] ${
                            touched.farmer && !farmerValid
                              ? "border-red-400 bg-red-50/50"
                              : "border-white/80 focus:border-brand"
                          }`}
                          value={farmer}
                          onChange={(e) => setFarmer(e.target.value)}
                          onBlur={() => setTouched((p) => ({ ...p, farmer: true }))}
                          placeholder={t("namePlaceholder")}
                          required
                        />
                      </label>
                      {touched.farmer && !farmerValid && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          {t("errValidName")}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label className="block min-w-0">
                        <span className="mb-1.5 block text-xs lg:text-sm font-semibold text-brand-deep">
                          {t("phone")} <span className="text-red-500">*</span>
                        </span>
                        <div className="flex items-center min-w-0 rounded-xl border border-white/80 bg-white/85 px-3 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand min-h-[48px]">
                          <span className="text-xs lg:text-sm font-bold text-brand-deep/75 pr-2.5 border-r border-gray-300 shrink-0">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            inputMode="numeric"
                            className="w-full min-w-0 bg-transparent px-2.5 py-3 text-sm lg:text-base font-semibold text-ink outline-none"
                            value={phoneDigits}
                            onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ""))}
                            onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                            placeholder={t("phonePlaceholder")}
                            required
                          />
                        </div>
                      </label>
                      {touched.phone && !phoneValid && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          {t("errValidPhone")}
                        </span>
                      )}

                      {/* WhatsApp Checkbox */}
                      <label className="mt-2.5 flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={hasWhatsapp}
                          onChange={(e) => setHasWhatsapp(e.target.checked)}
                          className="size-4 rounded text-brand focus:ring-brand"
                        />
                        <span className="text-xs font-medium text-brand-deep/80 flex items-center gap-1">
                          <MessageCircle className="size-3.5 text-emerald-600" />
                          {t("whatsappAvailable")}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error notice if submit failed */}
              {submitError && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-xs sm:text-sm text-red-900 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-5 text-red-600 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => executePostListing()}
                    className="font-bold text-red-800 underline hover:no-underline"
                  >
                    {t("retryBtn")}
                  </button>
                </div>
              )}

              {/* SUBMIT BUTTON WITH TRUST NOTE */}
              <div className="pt-4 border-t border-brand-deep/10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-brand px-6 py-4 text-base lg:text-lg font-bold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90 hover:scale-[1.008] active:scale-[0.99] disabled:opacity-60 min-h-[52px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>{t("publishingListing")}</span>
                    </>
                  ) : (
                    <>
                      <Sprout className="size-5" />
                      <span>{t("postListing")}</span>
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs lg:text-sm text-brand-deep/65">
                  {t("zeroCommissionTrust")}
                </p>
              </div>
            </form>
          </section>

          {/* ============================================================ */}
          {/* TASK 1 REQUIREMENT: PROPER GRID FOR PRODUCT PREVIEWS ON DESKTOP */}
          {/* ============================================================ */}
          <section className="rounded-3xl border border-white/60 bg-white/50 p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-brand-deep/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Store className="size-5" />
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-deep">
                    {t("activeHarvestsGridTitle")}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-brand-deep/70 mt-1">
                  {t("activeHarvestsGridSub")}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="size-3" />
                  Live Preview Network
                </span>
                <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-bold text-brand-deep">
                  {myListings.length} {t("listings")}
                </span>
              </div>
            </div>

            {/* PRODUCT PREVIEWS GRID: 1-col on mobile, 2-col on tablet, 3-col on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Interactive Live Draft Lot Preview */}
              <div className="rounded-2xl border-2 border-dashed border-brand/40 bg-white/70 p-5 shadow-xs relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-[11px] font-bold">
                      <Eye className="size-3 text-amber-700" />
                      Live Draft Preview
                    </span>
                    <span className="text-[11px] text-brand-deep/60 font-semibold">
                      Auto-syncing
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedCropImage.emoji}</span>
                    <div>
                      <h3 className="font-bold text-base text-brand-deep">
                        {cropName(cropId, lang)}
                      </h3>
                      <p className="text-xs text-brand-deep/60">
                        {quantity || "10"} {unit}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-brand/5 p-3 flex items-baseline justify-between">
                    <span className="text-xs text-brand-deep/70 font-semibold">Your Ask Price</span>
                    <span className="font-display text-xl font-bold text-brand">
                      {formatRupees(Number(price) || reference?.modal || 2000)}/{unit}
                    </span>
                  </div>

                  <div className="text-xs text-brand-deep/75 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-brand shrink-0" />
                      <span className="font-semibold">{placeObj.name}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-brand shrink-0" />
                      <span>{farmer || "Your Name"} ({phoneDigits ? `+91 ${phoneDigits}` : "+91 ..."})</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-deep/10 flex items-center justify-between text-[11px] text-brand-deep/60">
                  <span>Updates live as you type</span>
                  <span className="font-bold text-brand">0% Commission</span>
                </div>
              </div>

              {/* Cards 2+: User's Active Listings */}
              {myListings.map((l) => (
                <div key={l.id} className="h-full">
                  <ListingCard listing={l} />
                </div>
              ))}

              {/* Fallback Regional Highlight Lots if no other listings yet */}
              {myListings.length === 0 && (
                <>
                  <div className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-xs flex flex-col justify-between opacity-85">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[11px] font-bold">
                          Sample Mandi Lot
                        </span>
                        <span className="text-[11px] text-brand-deep/60">Coimbatore</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">🧅</span>
                        <div>
                          <h3 className="font-bold text-base text-brand-deep">
                            {cropName("onion", lang)}
                          </h3>
                          <p className="text-xs text-brand-deep/60">25 quintals · Grade A</p>
                        </div>
                      </div>
                      <div className="rounded-xl bg-emerald-50/70 p-3 flex items-baseline justify-between">
                        <span className="text-xs text-emerald-900/70 font-semibold">Today's Rate</span>
                        <span className="font-display text-xl font-bold text-emerald-800">
                          ₹2,400/qtl
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-brand-deep/60 border-t border-brand-deep/10 pt-2.5">
                      Verified APMC Lot · Ready for Instant Call
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-xs flex flex-col justify-between opacity-85">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[11px] font-bold">
                          Sample Mandi Lot
                        </span>
                        <span className="text-[11px] text-brand-deep/60">Yeshwanthpur</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">🥔</span>
                        <div>
                          <h3 className="font-bold text-base text-brand-deep">
                            {cropName("potato", lang)}
                          </h3>
                          <p className="text-xs text-brand-deep/60">40 quintals · 100% Organic</p>
                        </div>
                      </div>
                      <div className="rounded-xl bg-emerald-50/70 p-3 flex items-baseline justify-between">
                        <span className="text-xs text-emerald-900/70 font-semibold">Today's Rate</span>
                        <span className="font-display text-xl font-bold text-emerald-800">
                          ₹1,850/qtl
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-brand-deep/60 border-t border-brand-deep/10 pt-2.5">
                      Direct Farmer Connection · 0% Middleman
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {/* IN-PAGE PHONE OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Phone className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-deep">{t("quickOtpTitle")}</h3>
                  <p className="text-[11px] text-brand-deep/60">+91 {phoneDigits}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="grid size-7 place-items-center rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-brand-deep/70 leading-relaxed">
              {t("quickOtpSub")}
            </p>

            <div>
              <label className="block text-xs font-semibold text-brand-deep mb-1">
                {t("enterOtp")}
              </label>
              <input
                type="text"
                maxLength={4}
                autoFocus
                inputMode="numeric"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full text-center tracking-[0.5em] font-display text-2xl font-bold rounded-xl border border-gray-300 py-2.5 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <p className="mt-1 text-[11px] text-emerald-800 font-medium text-center">
                {t("demoOtpHint")}
              </p>
            </div>

            {otpError && (
              <p className="text-xs font-semibold text-red-600 text-center">{otpError}</p>
            )}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
              className="w-full rounded-xl bg-brand py-3 text-xs font-bold text-white shadow-md hover:bg-brand/90 transition flex items-center justify-center gap-2"
            >
              {isVerifyingOtp ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span>{t("verifyPublishBtn")}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// Reusable Live Rate Card Component
function RateCardContent({
  reference,
  placeName,
  cropId,
  lang,
}: {
  reference: PriceRow | undefined;
  placeName: string;
  cropId: string;
  lang: Lang;
}) {
  const { t } = useTranslation();
  const cropImage = getCropImage(cropId);

  return (
    <div className="rounded-2xl border border-white/80 bg-white/70 p-4 sm:p-5 shadow-2xs backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-brand-deep/10 pb-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep/65 flex items-center gap-1.5">
          <TrendingUp className="size-3.5 text-brand" />
          {t("ratesTitle")}
        </span>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
          {t("liveMandiRate")}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="text-2xl">{cropImage.emoji}</span>
        <div>
          <h4 className="font-bold text-sm text-brand-deep leading-tight">
            {cropName(cropId, lang)}
          </h4>
          <p className="text-xs text-brand-deep/60 flex items-center gap-1">
            <MapPin className="size-3 text-brand" />
            {placeName}
          </p>
        </div>
      </div>

      {reference ? (
        <div className="mt-3 space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl lg:text-3xl font-bold text-brand-deep">
              {formatRupees(reference.modal)}
            </span>
            <span className="text-xs text-brand-deep/60 font-medium">/{t("quintal")}</span>
          </div>

          <p className="text-xs text-brand-deep/75">
            {t("dailyMandiRange")} {formatRupees(reference.min)} – {formatRupees(reference.max)}
          </p>
        </div>
      ) : (
        <div className="mt-3 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 flex items-center gap-2">
          <HelpCircle className="size-4 text-amber-700 shrink-0" />
          <span>{t("rateNotAvailable")}</span>
        </div>
      )}

      <div className="mt-3 border-t border-brand-deep/10 pt-2 flex items-center justify-between text-[11px] text-brand-deep/60">
        <span>{t("verifiedApmc")}</span>
        <span>{t("zeroCut")}</span>
      </div>
    </div>
  );
}
