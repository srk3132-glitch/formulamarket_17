import { useState, useMemo } from "react";
import { cropName, useI18n, type CropCategory } from "@/lib/i18n";
import { formatRupees, formatRupeesPerKg, useLivePrices } from "@/lib/prices";
import { useRegion } from "@/lib/region-store";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function PriceBoard({ limit }: { limit?: number }) {
  const { t, lang } = useI18n();
  const { region, placeName, stateName } = useRegion();
  const { rows, updatedAt } = useLivePrices(region.placeId);

  const [selectedCategory, setSelectedCategory] = useState<"all" | CropCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unitMode, setUnitMode] = useState<"quintal" | "kg">("kg");
  const [expanded, setExpanded] = useState(false);

  // Filter rows by category and search
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Category match
      if (selectedCategory !== "all" && row.category !== selectedCategory) {
        return false;
      }
      // Search match in current language or English
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const localizedName = cropName(row.cropId, lang).toLowerCase();
        const englishName = row.cropId.toLowerCase();
        return localizedName.includes(query) || englishName.includes(query);
      }
      return true;
    });
  }, [rows, selectedCategory, searchQuery, lang]);

  // Apply limit if specified and not expanded
  const displayRows =
    limit && !expanded && !searchQuery.trim() ? filteredRows.slice(0, limit) : filteredRows;

  // Counts for category badges
  const counts = useMemo(() => {
    return {
      all: rows.length,
      vegetable: rows.filter((r) => r.category === "vegetable").length,
      fruit: rows.filter((r) => r.category === "fruit").length,
      grain_spice: rows.filter((r) => r.category === "grain_spice").length,
    };
  }, [rows]);

  return (
    <section className="mt-6 rounded-3xl border border-white/60 bg-white/45 p-5 sm:p-7 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
      {/* Header bar with title, streaming status, and timestamp */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-brand-deep/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <Sparkles className="size-3" />
              Live APMC Market Rates
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-semibold text-brand-deep/70 shadow-sm backdrop-blur-xl">
              <span className="livedot inline-block size-1.5 rounded-full bg-brand" />
              {t("streaming")}
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-deep">
            {t("ratesTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-brand-deep/60">
            {placeName} Mandi · {stateName}
            {updatedAt ? ` · Live tick ${updatedAt}` : ""}
          </p>
        </div>

        {/* Unit Toggle: Kg [kilograms] vs Quintal */}
        <div className="flex items-center gap-1 rounded-full border border-white/80 bg-white/70 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setUnitMode("kg")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              unitMode === "kg"
                ? "bg-brand text-primary-foreground shadow-sm"
                : "text-brand-deep/70 hover:bg-white"
            }`}
          >
            ₹ / kg [kilograms]
          </button>
          <button
            type="button"
            onClick={() => setUnitMode("quintal")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              unitMode === "quintal"
                ? "bg-brand text-primary-foreground shadow-sm"
                : "text-brand-deep/70 hover:bg-white"
            }`}
          >
            ₹ / {t("quintal")} (100kg)
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === "all"
                ? "bg-brand text-primary-foreground shadow-sm"
                : "border border-white/70 bg-white/60 text-brand-deep/70 hover:bg-white hover:text-brand-deep"
            }`}
          >
            {t("all")} ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("vegetable")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === "vegetable"
                ? "bg-emerald-700 text-white shadow-sm"
                : "border border-white/70 bg-white/60 text-brand-deep/70 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            🥦 {t("vegetables")} ({counts.vegetable})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("fruit")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === "fruit"
                ? "bg-amber-700 text-white shadow-sm"
                : "border border-white/70 bg-white/60 text-brand-deep/70 hover:bg-amber-50 hover:text-amber-950"
            }`}
          >
            🍎 {t("fruits")} ({counts.fruit})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("grain_spice")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === "grain_spice"
                ? "bg-yellow-800 text-white shadow-sm"
                : "border border-white/70 bg-white/60 text-brand-deep/70 hover:bg-yellow-50 hover:text-yellow-950"
            }`}
          >
            🌾 {t("grainsSpices")} ({counts.grain_spice})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-2.5 size-4 text-brand-deep/40" />
          <input
            type="text"
            placeholder={t("searchProduce")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/80 bg-white/70 py-2 pl-9 pr-3 text-xs font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-brand/60 focus:bg-white"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-xs text-brand-deep/40 hover:text-brand-deep"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {/* Produce Rate Cards Grid */}
      {displayRows.length === 0 ? (
        <div className="rounded-2xl border border-white/60 bg-white/40 p-8 text-center">
          <p className="text-sm font-semibold text-brand-deep">
            No produce matching "{searchQuery}"
          </p>
          <p className="mt-1 text-xs text-brand-deep/60">
            Try searching for tomatoes, onions, mangoes, apples, or clear your search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-3 rounded-xl bg-brand px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand/90"
          >
            Show All Produce
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayRows.map((row) => {
            const rising = row.changePct >= 0;
            const categoryEmoji =
              row.category === "vegetable" ? "🥦" : row.category === "fruit" ? "🍎" : "🌾";

            const priceDisplay =
              unitMode === "quintal" ? formatRupees(row.modal) : formatRupeesPerKg(row.modal);

            const unitLabel = unitMode === "quintal" ? `/${t("quintal")}` : "/kg";

            const minDisplay =
              unitMode === "quintal" ? formatRupees(row.min) : formatRupeesPerKg(row.min);

            const maxDisplay =
              unitMode === "quintal" ? formatRupees(row.max) : formatRupeesPerKg(row.max);

            return (
              <div
                key={row.cropId}
                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur-xl transition hover:border-brand/40 hover:bg-white/80 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">
                      {categoryEmoji}
                    </span>
                    <div>
                      <p className="font-semibold text-brand-deep text-sm leading-snug">
                        {cropName(row.cropId, lang)}
                      </p>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-brand-deep/50">
                        {row.category === "vegetable"
                          ? "Vegetable"
                          : row.category === "fruit"
                            ? "Fruit"
                            : "Grain/Spice"}
                      </span>
                    </div>
                  </div>

                  {/* Trend Indicator */}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      rising ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rising ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {rising ? "+" : ""}
                    {row.changePct}%
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline justify-between border-t border-brand-deep/5 pt-2">
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-deep">
                    {priceDisplay}{" "}
                    <span className="text-xs font-normal text-brand-deep/60">{unitLabel}</span>
                  </p>
                  <span className="text-[11px] font-semibold text-brand-deep/70">Modal Rate</span>
                </div>

                {/* Range and Market Activity */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-brand-deep/60">
                  <span>
                    Range: {minDisplay} – {maxDisplay}
                  </span>
                  <span
                    className={`font-semibold ${
                      row.changePct > 3
                        ? "text-emerald-700"
                        : row.changePct < -1
                          ? "text-amber-700"
                          : "text-brand-deep/60"
                    }`}
                  >
                    {row.changePct > 3
                      ? t("highDemand")
                      : row.changePct < -1
                        ? t("cooling")
                        : t("steady")}
                  </span>
                </div>

                {/* Progress bar visualizer */}
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      rising ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{
                      width: `${Math.min(95, Math.max(25, 50 + row.changePct * 4))}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expand / Collapse Toggle if limited */}
      {limit && filteredRows.length > limit && !searchQuery.trim() ? (
        <div className="mt-5 text-center border-t border-brand-deep/10 pt-4">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand/30 bg-white/80 px-4 py-2 text-xs font-semibold text-brand shadow-sm transition hover:bg-brand hover:text-white"
          >
            {expanded ? (
              <>
                <span>Show Fewer ({limit} crops)</span>
                <ChevronUp className="size-4" />
              </>
            ) : (
              <>
                <span>View All {filteredRows.length} Fruits & Vegetables Rates</span>
                <ChevronDown className="size-4" />
              </>
            )}
          </button>
        </div>
      ) : null}
    </section>
  );
}
