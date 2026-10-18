import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { CROPS, cropName, useI18n, type CropCategory } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { formatRupees, useLivePrices } from "@/lib/prices";
import { getCropImage } from "@/lib/listings-store";
import { RegionSelector } from "@/components/RegionSelector";
import { RatesEmptyState } from "@/components/common/RatesEmptyState";
import { RatesMobileSkeleton } from "@/components/common/RatesSkeleton";
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sprout,
  Store,
} from "lucide-react";

export default function RatesMobileView() {
  const { t, lang } = useI18n();
  const { region, placeName, districtName, stateName } = useRegion();
  const { rows: rawPrices, updatedAt } = useLivePrices(region.placeId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CropCategory>("all");
  const [unitMode, setUnitMode] = useState<"kg" | "quintal">("kg");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const filteredPrices = useMemo(() => {
    return rawPrices.filter((item) => {
      const crop = CROPS.find((c) => c.id === item.cropId);
      if (!crop) return false;

      if (selectedCategory !== "all" && crop.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const localizedName = cropName(crop.id, lang).toLowerCase();
        const englishName = crop.en.toLowerCase();
        return localizedName.includes(q) || englishName.includes(q);
      }

      return true;
    });
  }, [rawPrices, selectedCategory, searchQuery, lang]);

  return (
    <div className="flex flex-col pb-8">
      {/* 1. Compact Header & Location Banner */}
      <div className="px-3.5 pt-3">
        <div className="rounded-2xl border border-teal-600/20 bg-white/80 p-3.5 shadow-xs backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="livedot inline-block size-2 rounded-full bg-teal-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900">
                Live Mandi Feed
              </span>
            </div>
            <span className="text-[10px] text-brand-deep/60">
              {updatedAt ? `Updated ${updatedAt}` : "Streaming"}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <h1 className="font-display text-lg font-bold text-brand-deep">
                {placeName} Mandi Rates
              </h1>
              <p className="text-xs text-brand-deep/70">
                {districtName}, {stateName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLocationPicker((prev) => !prev)}
              className="flex items-center gap-1 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-xs font-bold text-brand active:scale-95 transition min-h-[44px]"
              aria-label="Change mandi location"
            >
              <MapPin className="size-3.5" />
              <span>Change</span>
              {showLocationPicker ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
          </div>

          {/* Expandable Location Selector */}
          {showLocationPicker && (
            <div className="mt-3 pt-3 border-t border-brand-deep/10 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-brand-deep/60">
                Select State, District & Mandi
              </p>
              <RegionSelector layout="vertical" />
            </div>
          )}
        </div>
      </div>

      {/* 2. Sticky Search Bar */}
      <div className="sticky top-14 z-30 mt-3 border-y border-brand-deep/10 bg-white/95 px-3.5 py-2.5 backdrop-blur-xl shadow-xs">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3.5 size-4 text-brand-deep/40" />
          <input
            type="search"
            inputMode="search"
            placeholder="Search crop in English, தமிழ், తెలుగు..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-brand-deep/20 bg-white/90 py-2.5 pl-10 pr-9 text-base font-semibold text-brand-deep placeholder:text-brand-deep/40 placeholder:font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
            aria-label="Search crops"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 grid size-8 place-items-center text-brand-deep/50 hover:text-brand-deep active:scale-90"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* 3. Horizontally Scrollable Category Chips + Unit Toggle */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          {/* Scrollable category pills */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 min-h-[40px] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                selectedCategory === "all"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white/80 border border-brand-deep/15 text-brand-deep/70"
              }`}
            >
              All (39)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("vegetable")}
              className={`shrink-0 min-h-[40px] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                selectedCategory === "vegetable"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white/80 border border-brand-deep/15 text-brand-deep/70"
              }`}
            >
              Vegetables (17)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("fruit")}
              className={`shrink-0 min-h-[40px] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                selectedCategory === "fruit"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white/80 border border-brand-deep/15 text-brand-deep/70"
              }`}
            >
              Fruits (13)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("grain_spice")}
              className={`shrink-0 min-h-[40px] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                selectedCategory === "grain_spice"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white/80 border border-brand-deep/15 text-brand-deep/70"
              }`}
            >
              Grains & Spices (9)
            </button>
          </div>

          {/* Unit Toggle Pill */}
          <div className="flex shrink-0 items-center rounded-xl border border-brand-deep/20 bg-white/90 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setUnitMode("kg")}
              className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                unitMode === "kg"
                  ? "bg-brand text-white shadow-xs"
                  : "text-brand-deep/70"
              }`}
            >
              /kg
            </button>
            <button
              type="button"
              onClick={() => setUnitMode("quintal")}
              className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                unitMode === "quintal"
                  ? "bg-brand text-white shadow-xs"
                  : "text-brand-deep/70"
              }`}
            >
              /qtl
            </button>
          </div>
        </div>
      </div>

      {/* 4. One Crop per Row as a Card */}
      <div className="px-3.5 pt-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-deep/60">
          Showing {filteredPrices.length} live mandi crops
        </p>

        {filteredPrices.length === 0 ? (
          <RatesEmptyState
            query={searchQuery}
            onReset={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredPrices.map((item) => {
              const isGain = item.changePct > 0.5;
              const isLoss = item.changePct < -0.5;
              const kgRate = (item.modal / 100).toFixed(1);
              const kgMin = (item.min / 100).toFixed(1);
              const kgMax = (item.max / 100).toFixed(1);

              const crop = CROPS.find((c) => c.id === item.cropId);
              const image = getCropImage(item.cropId).src;

              return (
                <article
                  key={item.cropId}
                  className="rounded-2xl border border-white/80 bg-white/75 p-3.5 shadow-xs backdrop-blur-xl transition active:bg-white"
                >
                  {/* Top Row: Crop Icon/Image + Name + Modal Rate + % Change */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-brand-deep/10 bg-brand/10">
                        {image ? (
                          <img
                            src={image}
                            alt=""
                            width={44}
                            height={44}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-sm font-bold text-brand">
                            🌾
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 leading-tight">
                        <h2 className="font-display text-base font-bold text-brand-deep truncate">
                          {cropName(item.cropId, lang)}
                        </h2>
                        <p className="text-[11px] text-brand-deep/60 truncate">
                          {crop?.en} · {item.category.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-display text-lg font-bold text-ink">
                        {unitMode === "kg" ? `₹${kgRate}` : formatRupees(item.modal)}
                        <span className="text-[10px] font-normal text-brand-deep/60">
                          {unitMode === "kg" ? "/kg" : "/qtl"}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isGain
                            ? "bg-emerald-100 text-emerald-800"
                            : isLoss
                              ? "bg-rose-100 text-rose-800"
                              : "bg-black/5 text-brand-deep/70"
                        }`}
                      >
                        {isGain ? (
                          <TrendingUp className="size-3" />
                        ) : isLoss ? (
                          <TrendingDown className="size-3" />
                        ) : (
                          <Minus className="size-3" />
                        )}
                        <span>
                          {item.changePct > 0 ? `+${item.changePct}%` : `${item.changePct}%`}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Min-Max range + 1-Tap Sell/Buy buttons */}
                  <div className="mt-3 pt-2.5 border-t border-brand-deep/5 flex items-center justify-between gap-2 min-w-0">
                    <div className="text-[11px] text-brand-deep/70 font-medium truncate min-w-0">
                      Range:{" "}
                      <strong>
                        {unitMode === "kg" ? `₹${kgMin}` : formatRupees(item.min)}
                      </strong>{" "}
                      –{" "}
                      <strong>
                        {unitMode === "kg" ? `₹${kgMax}` : formatRupees(item.max)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to="/sell"
                        className="flex items-center gap-1 rounded-lg bg-emerald-100/80 px-2.5 py-1.5 text-[11px] font-bold text-emerald-900 active:scale-95 min-h-[36px]"
                      >
                        <Sprout className="size-3 text-emerald-700" />
                        <span>Sell</span>
                      </Link>
                      <Link
                        to="/buy"
                        className="flex items-center gap-1 rounded-lg bg-amber-100/80 px-2.5 py-1.5 text-[11px] font-bold text-amber-950 active:scale-95 min-h-[36px]"
                      >
                        <Store className="size-3 text-amber-800" />
                        <span>Buy</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
