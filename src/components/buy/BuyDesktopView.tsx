import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { InterfaceModeNav } from "@/components/InterfaceModeNav";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import { useI18n, cropName, CROPS } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import {
  Store,
  Sprout,
  ArrowRightLeft,
  Building2,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function BuyDesktopView() {
  const { t, lang } = useI18n();
  const { region, placeName, districtName, stateName } = useRegion();
  const {
    listings,
    isLoading,
    error,
    refreshListings,
    latestNewListing,
    newListingAlertCount,
    clearLatestListing,
  } = useListings();
  const { user, isAuthenticated, switchRole, quickLoginDemo } = useAuth();
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCrop, setFilterCrop] = useState<string>("all");

  const inRegion = listings.filter((l) => l.stateId === region.stateId);
  const baseListings = inRegion.length > 0 ? inRegion : listings;

  const shown = baseListings.filter((l) => {
    if (filterCrop !== "all" && l.cropId !== filterCrop) return false;
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    const localized = cropName(l.cropId, lang).toLowerCase();
    return (
      l.cropId.toLowerCase().includes(q) ||
      localized.includes(q) ||
      l.farmer.toLowerCase().includes(q) ||
      l.placeName.toLowerCase().includes(q)
    );
  });

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-8 animate-fade-in">
      <InterfaceModeNav currentMode="buy" />

      {/* Top Banner */}
      <section className="rounded-3xl border border-white/60 bg-white/40 p-7 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                <Store className="size-3.5" />
                Procurement Marketplace
              </span>
              <span className="text-xs text-brand-deep/60">Farm-Gate Direct Sourcing</span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-deep">
              {t("buyTitle")}
            </h1>
            <p className="mt-1 text-sm text-brand-deep/70">
              Fresh produce lots available near <strong>{placeName}</strong> ({districtName}, {stateName}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refreshListings()}
              disabled={isLoading}
              title="Refresh listings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-white/80 px-3 py-1.5 text-xs font-semibold text-brand-deep shadow-2xs hover:bg-white transition"
            >
              <RefreshCw className={`size-3.5 text-brand ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            {isAuthenticated && user?.role === "buyer" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                <Store className="size-3.5" />
                {t("loggedAsBuyer")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Auth prompt if unauthenticated */}
        {!isAuthenticated && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-600/30 bg-amber-50/70 p-3.5 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-amber-800 shrink-0" />
              <span>
                Commercial trader or retailer? Sign in as a Buyer to lock in lots with direct farmer contacts.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => quickLoginDemo("buyer", 0)}
                className="rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-900"
              >
                ⚡ Instant Sign In
              </button>
              <Link
                to="/login"
                search={{ role: "buyer", redirect: "/buy" }}
                className="font-semibold text-amber-900 hover:underline"
              >
                Full Portal →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 2-Column Layout: Left Filters Sidebar, Right Listings Grid */}
      <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/70 bg-white/50 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-deep/10">
              <Filter className="size-4 text-amber-800" />
              <h2 className="font-display text-sm font-bold text-brand-deep">
                Procurement Filters
              </h2>
            </div>

            {/* Crop Filter */}
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-deep/60">
                Crop
              </p>
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 text-xs font-semibold text-brand-deep outline-none focus:border-brand"
              >
                <option value="all">All Crops (सभी फसलें)</option>
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {cropName(c.id, lang)}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Selector */}
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-deep/60">
                Region & Mandi
              </p>
              <RegionSelector layout="vertical" />
            </div>

            {/* Live Benchmark Reference */}
            <div className="mt-5 pt-4 border-t border-brand-deep/10">
              <div className="rounded-2xl border border-teal-600/30 bg-teal-50/70 p-3.5 text-xs">
                <p className="font-bold text-teal-950">
                  APMC Benchmark Active
                </p>
                <p className="text-[11px] text-teal-900/70 mt-0.5">
                  Check live mandi modal prices before calling farmers.
                </p>
                <Link
                  to="/rates"
                  className="mt-2.5 inline-flex items-center gap-1 font-bold text-teal-800 hover:underline text-xs"
                >
                  <span>Open Rates Board</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Listings Grid */}
        <section className="space-y-4">
          {/* Realtime Live Arrival Banner */}
          {latestNewListing && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-50/90 p-3.5 shadow-sm backdrop-blur-xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2.5">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-emerald-600"></span>
                </span>
                <div>
                  <p className="text-xs font-bold text-emerald-950">
                    ⚡ Just Listed in Real-Time: {latestNewListing.farmer} posted{" "}
                    {latestNewListing.quantity} quintal(s) of {cropName(latestNewListing.cropId, lang)}!
                  </p>
                  <p className="text-[11px] text-emerald-900/70">
                    Location: {latestNewListing.placeName} · Shared across all devices instantly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearLatestListing}
                className="rounded-lg bg-emerald-200/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-200 transition"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 text-red-600 shrink-0" />
                <span>Could not sync listings from database: {error}</span>
              </div>
              <button
                type="button"
                onClick={() => refreshListings()}
                className="rounded-lg bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/60 p-3 shadow-xs backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                  Available Farm Lots ({shown.length})
                </p>
                {newListingAlertCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 animate-pulse">
                    +{newListingAlertCount} Live Ingested
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-deep/50">
                Direct farm-gate harvests with verified farmer contacts
              </p>
            </div>

            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-2.5 size-4 text-brand-deep/40" />
              <input
                type="text"
                placeholder="Search harvest crop or farmer..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/80 py-2 pl-9 pr-3 text-xs font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-amber-700 focus:bg-white transition"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-3xl border border-white/70 bg-white/40 p-4 shadow-sm animate-pulse"
                >
                  <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200/70" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-gray-200/80" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-gray-200/60" />
                  <div className="mt-4 h-9 w-full rounded-xl bg-gray-200/70" />
                </div>
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-deep/20 bg-white/40 p-10 text-center">
              <p className="font-display text-lg font-semibold text-brand-deep">
                {filterCrop !== "all"
                  ? `No listings yet for ${cropName(filterCrop, lang)}`
                  : "No lots match your search"}
              </p>
              <p className="mt-1 text-xs text-brand-deep/60">
                Try clearing your search/filters or select a neighbouring district.
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterQuery("");
                    setFilterCrop("all");
                  }}
                  className="rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white"
                >
                  Clear Filters
                </button>
                <Link
                  to="/sell"
                  className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand/90 transition inline-flex items-center gap-1.5"
                >
                  <Sprout className="size-3.5" />
                  Post Harvest
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
