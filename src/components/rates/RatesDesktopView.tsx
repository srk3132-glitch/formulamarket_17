import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { InterfaceModeNav } from "@/components/InterfaceModeNav";
import { RegionSelector } from "@/components/RegionSelector";
import { CROPS, cropName, useI18n, type CropCategory } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { formatRupees, useLivePrices } from "@/lib/prices";
import { RatesEmptyState } from "@/components/common/RatesEmptyState";
import { getCropImage } from "@/lib/crop-images";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Sprout,
  Store,
  Filter,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function RatesDesktopView() {
  const { t, lang } = useI18n();
  const { region, placeName, districtName, stateName } = useRegion();
  const { rows: rawPrices, updatedAt } = useLivePrices(region.placeId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CropCategory>("all");
  const [unitMode, setUnitMode] = useState<"kg" | "quintal">("kg");

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

  // Summary statistics
  const stats = useMemo(() => {
    let highestGainer = rawPrices[0];
    let coolingCount = 0;
    let surgingCount = 0;
    let totalValue = 0;

    for (const r of rawPrices) {
      totalValue += r.modal;
      if (r.changePct > (highestGainer?.changePct ?? 0)) highestGainer = r;
      if (r.changePct > 2) surgingCount++;
      if (r.changePct < -2) coolingCount++;
    }

    return {
      highestGainerCrop: highestGainer ? cropName(highestGainer.cropId, lang) : "Tomato",
      highestGainerPct: highestGainer?.changePct ?? 0,
      surgingCount,
      coolingCount,
      avgRate: Math.round(totalValue / (rawPrices.length || 1)),
    };
  }, [rawPrices, lang]);

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-8 animate-fade-in">
      <InterfaceModeNav currentMode="rates" />

      {/* Header Banner */}
      <section className="rounded-3xl border border-white/70 bg-white/50 p-7 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-deep/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-900 shadow-xs">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-teal-600" />
                </span>
                Live Mandi Discovery
              </span>
              <span className="text-xs text-brand-deep/60">
                APMC Real-time Feed · {updatedAt ? `Updated ${updatedAt}` : "Streaming"}
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-deep">
              Live Mandi Price Benchmark
            </h1>
            <p className="mt-1 text-sm text-brand-deep/70">
              Benchmark rates for <strong>{placeName} Market</strong> ({districtName}, {stateName}) across 111 South Indian districts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/sell"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <Sprout className="size-3.5" />
              <span>List Your Harvest</span>
            </Link>
            <Link
              to="/buy"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800"
            >
              <Store className="size-3.5" />
              <span>Buy Produce</span>
            </Link>
          </div>
        </div>

        {/* Continuous Animated Mandi Ticker Tape */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/80 bg-white/40 p-2.5 shadow-sm backdrop-blur-xl group/ticker">
          <div className="flex items-center justify-between px-2 pb-1.5 border-b border-brand-deep/5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-600" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/70">
                Live Mandi Ticker · Click crop to filter · Hover to pause
              </span>
            </div>
            <span className="text-[10px] text-brand-deep/50">
              39 Commodities Active
            </span>
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-ticker flex items-center gap-2.5 group-hover/ticker:[animation-play-state:paused]">
              {[...rawPrices, ...rawPrices].map((item, idx) => {
                const isUp = item.changePct > 0;
                const cropImg = getCropImage(item.cropId);
                const rateText =
                  unitMode === "kg"
                    ? `₹${(item.modal / 100).toFixed(1)}/kg`
                    : formatRupees(item.modal);
                return (
                  <button
                    key={`${item.cropId}-${idx}`}
                    type="button"
                    onClick={() => setSearchQuery(cropName(item.cropId, lang))}
                    className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 pl-1.5 pr-3 py-1 text-xs font-semibold text-brand-deep shadow-xs transition hover:bg-white hover:scale-105 active:scale-95"
                  >
                    <img
                      src={cropImg.src}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 rounded-full object-cover shrink-0"
                    />
                    <span>{cropName(item.cropId, lang)}</span>
                    <span className="font-bold text-ink">{rateText}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        isUp ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {isUp ? "▲" : "▼"} {Math.abs(item.changePct)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Market Vital Stat Cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/70 bg-white/60 p-3.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/50">
              Commodities Tracked
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-brand-deep">
              {CROPS.length} Produce
            </p>
            <p className="text-[10px] text-teal-700 font-medium mt-0.5">100% APMC aligned</p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/60 p-3.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/50">
              Top Gainer Today
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-teal-900 truncate">
              {stats.highestGainerCrop}
            </p>
            <p className="text-[10px] text-teal-700 font-semibold mt-0.5">
              +{stats.highestGainerPct}% 24h movement
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/60 p-3.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/50">
              Market Sentiment
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-brand-deep">
              {stats.surgingCount} Surging
            </p>
            <p className="text-[10px] text-amber-800 font-medium mt-0.5">
              {stats.coolingCount} Cooling rates
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/60 p-3.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/50">
              Average Modal Rate
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-brand-deep">
              {unitMode === "kg"
                ? `₹${(stats.avgRate / 100).toFixed(1)}/kg`
                : formatRupees(stats.avgRate)}
            </p>
            <p className="text-[10px] text-brand-deep/60 mt-0.5">
              {unitMode === "kg" ? "weighted per kg" : "per quintal average"}
            </p>
          </div>
        </div>
      </section>

      {/* Main 2-Column Area: Filter Sidebar on Left, Rates Grid on Right */}
      <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Filter Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/70 bg-white/50 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-deep/10">
              <Filter className="size-4 text-brand" />
              <h2 className="font-display text-sm font-bold text-brand-deep">
                Market Filters
              </h2>
            </div>

            {/* Region Location Picker */}
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-deep/60">
                Location ({stateName})
              </p>
              <RegionSelector layout="vertical" />
            </div>

            {/* Category Filter Pills */}
            <div className="mt-5 pt-4 border-t border-brand-deep/10">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-deep/60">
                Category
              </p>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    selectedCategory === "all"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-brand-deep hover:bg-white/80"
                  }`}
                >
                  <span>All Produce</span>
                  <span className="opacity-75">{CROPS.length}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("vegetable")}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    selectedCategory === "vegetable"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-brand-deep hover:bg-white/80"
                  }`}
                >
                  <span>Vegetables</span>
                  <span className="opacity-75">17</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("fruit")}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    selectedCategory === "fruit"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-brand-deep hover:bg-white/80"
                  }`}
                >
                  <span>Fruits</span>
                  <span className="opacity-75">13</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("grain_spice")}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    selectedCategory === "grain_spice"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-brand-deep hover:bg-white/80"
                  }`}
                >
                  <span>Grains & Spices</span>
                  <span className="opacity-75">9</span>
                </button>
              </div>
            </div>

            {/* Unit Pricing Toggle */}
            <div className="mt-5 pt-4 border-t border-brand-deep/10">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-deep/60">
                Display Unit
              </p>
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-brand-deep/15 bg-white/70 p-1">
                <button
                  type="button"
                  onClick={() => setUnitMode("kg")}
                  className={`rounded-lg py-1.5 text-xs font-bold transition ${
                    unitMode === "kg"
                      ? "bg-brand text-white shadow-xs"
                      : "text-brand-deep/70 hover:bg-white"
                  }`}
                >
                  ₹ / kg
                </button>
                <button
                  type="button"
                  onClick={() => setUnitMode("quintal")}
                  className={`rounded-lg py-1.5 text-xs font-bold transition ${
                    unitMode === "quintal"
                      ? "bg-brand text-white shadow-xs"
                      : "text-brand-deep/70 hover:bg-white"
                  }`}
                >
                  ₹ / quintal
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Commodity Grid Area */}
        <section className="space-y-4">
          {/* Top Control Bar: Search & Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/60 p-3 shadow-xs backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-deep/70">
              {filteredPrices.length} live benchmark rates for {placeName}
            </p>

            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-2.5 size-4 text-brand-deep/40" />
              <input
                type="text"
                placeholder="Search crop in English, தமிழ், తెలుగు..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/80 py-2 pl-9 pr-3 text-xs font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-teal-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Rates Grid */}
          {filteredPrices.length === 0 ? (
            <RatesEmptyState
              query={searchQuery}
              onReset={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPrices.map((item) => {
                const isGain = item.changePct > 0.5;
                const isLoss = item.changePct < -0.5;
                const kgRate = (item.modal / 100).toFixed(1);
                const kgMin = (item.min / 100).toFixed(1);
                const kgMax = (item.max / 100).toFixed(1);

                const cropImg = getCropImage(item.cropId);

                return (
                  <article
                    key={item.cropId}
                    className="card-interactive group flex flex-col justify-between rounded-3xl border border-white/70 bg-white/55 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition hover:border-teal-600/50 hover:bg-white/85"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Realistic Produce Photo */}
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-white/80 bg-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <img
                              src={cropImg.src}
                              alt={cropName(item.cropId, lang)}
                              width={56}
                              height={56}
                              loading="lazy"
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="inline-block rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-deep/60">
                              {item.category.replace("_", " ")}
                            </span>
                            <h3 className="mt-0.5 font-display text-lg font-bold text-brand-deep group-hover:text-teal-900 transition-colors truncate">
                              {cropName(item.cropId, lang)}
                            </h3>
                            <p className="text-[11px] text-brand-deep/50 truncate">
                              {CROPS.find((c) => c.id === item.cropId)?.en}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-transform group-hover:scale-105 shrink-0 ${
                            isGain
                              ? "bg-emerald-100 text-emerald-800"
                              : isLoss
                                ? "bg-rose-100 text-rose-800"
                                : "bg-black/5 text-brand-deep/70"
                          }`}
                        >
                          {isGain ? (
                            <TrendingUp className="size-3.5" />
                          ) : isLoss ? (
                            <TrendingDown className="size-3.5" />
                          ) : (
                            <Minus className="size-3.5" />
                          )}
                          <span>
                            {item.changePct > 0 ? `+${item.changePct}%` : `${item.changePct}%`}
                          </span>
                        </span>
                      </div>

                      {/* Modal Price Box */}
                      <div className="mt-4 rounded-2xl border border-brand-deep/10 bg-white/75 p-3.5 shadow-xs transition-colors group-hover:bg-white/95">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep/50">
                            Modal Price ({placeName})
                          </span>
                          <span className="text-[11px] font-semibold text-teal-800">
                            {unitMode === "kg" ? formatRupees(item.modal) + " /qtl" : `₹${kgRate}/kg`}
                          </span>
                        </div>
                        <p className="mt-1 font-display text-2xl font-bold text-brand-deep">
                          {unitMode === "kg" ? `₹${kgRate}` : formatRupees(item.modal)}
                          <span className="text-xs font-normal text-brand-deep/60">
                            {unitMode === "kg" ? " / kg" : " / quintal"}
                          </span>
                        </p>
                        <div className="mt-2 flex items-center justify-between border-t border-brand-deep/5 pt-2 text-[11px] text-brand-deep/60">
                          <span>
                            Min: {unitMode === "kg" ? `₹${kgMin}/kg` : formatRupees(item.min)}
                          </span>
                          <span>
                            Max: {unitMode === "kg" ? `₹${kgMax}/kg` : formatRupees(item.max)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-brand-deep/10 pt-3">
                      <Link
                        to="/sell"
                        className="flex items-center justify-center gap-1 rounded-xl bg-emerald-700/10 py-2 text-center text-xs font-semibold text-emerald-900 transition hover:bg-emerald-700 hover:text-white"
                      >
                        <Sprout className="size-3.5" />
                        <span>Sell Harvest</span>
                      </Link>

                      <Link
                        to="/buy"
                        className="flex items-center justify-center gap-1 rounded-xl bg-amber-800/10 py-2 text-center text-xs font-semibold text-amber-950 transition hover:bg-amber-800 hover:text-white"
                      >
                        <Store className="size-3.5" />
                        <span>Buy Produce</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
