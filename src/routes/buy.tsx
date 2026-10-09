import { createFileRoute, Link } from "@tanstack/react-router";
import { ListingCard } from "@/components/ListingCard";
import { useI18n, cropName, CROPS } from "@/lib/i18n";
import { useRegion, STATES } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import {
  Store,
  Sprout,
  ArrowRightLeft,
  Building2,
  Search,
  Sparkles,
  Radio,
  Bell,
  RefreshCw,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy Direct From Farmers — Formula Market" },
      {
        name: "description",
        content:
          "Browse fresh harvests listed by farmers across India with live mandi prices for benchmark reference.",
      },
      { property: "og:title", content: "Buy Direct From Farmers — Formula Market" },
      {
        property: "og:description",
        content:
          "Fresh produce listed straight from the field, with today's mandi rates alongside.",
      },
    ],
  }),
  headers: () => ({
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  }),
  component: BuyPage,
});

function BuyPage() {
  const { t, lang } = useI18n();
  const { region } = useRegion();
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

  const [filterCrop, setFilterCrop] = useState<string>("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    if (latestNewListing) {
      toast.success(
        `🌾 Live Harvest: ${latestNewListing.farmer} listed ${latestNewListing.quantity} quintals of ${cropName(latestNewListing.cropId, lang)}!`,
        { duration: 5000 },
      );
    }
  }, [latestNewListing, lang]);

  // Available districts based on selected state
  const availableDistricts = useMemo(() => {
    if (filterState === "all") return [];
    const matchedState = STATES.find((s) => s.id === filterState);
    return matchedState?.districts || [];
  }, [filterState]);

  // Handle state change: reset district
  const handleStateChange = (newState: string) => {
    setFilterState(newState);
    setFilterDistrict("all");
  };

  // Filter listings by crop, state, district, and search query
  const shown = useMemo(() => {
    return listings.filter((l) => {
      // 1. Crop filter
      if (filterCrop !== "all" && l.cropId !== filterCrop) {
        return false;
      }
      // 2. State filter
      if (filterState !== "all" && l.stateId !== filterState) {
        return false;
      }
      // 3. District filter
      if (filterDistrict !== "all" && l.districtId !== filterDistrict) {
        return false;
      }
      // 4. Search query
      if (filterQuery.trim()) {
        const q = filterQuery.toLowerCase();
        const matchesCrop = cropName(l.cropId, lang).toLowerCase().includes(q);
        const matchesFarmer = l.farmer.toLowerCase().includes(q);
        const matchesPlace = l.placeName.toLowerCase().includes(q);
        const matchesDistrict = (l.district || l.districtId || "").toLowerCase().includes(q);
        if (!matchesCrop && !matchesFarmer && !matchesPlace && !matchesDistrict) {
          return false;
        }
      }
      return true;
    });
  }, [listings, filterCrop, filterState, filterDistrict, filterQuery, lang]);

  const hasActiveFilters =
    filterCrop !== "all" ||
    filterState !== "all" ||
    filterDistrict !== "all" ||
    Boolean(filterQuery.trim());

  const clearAllFilters = () => {
    setFilterCrop("all");
    setFilterState("all");
    setFilterDistrict("all");
    setFilterQuery("");
  };

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-8">
      <section className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                <Store className="size-3.5" />
                Procurement Marketplace
              </span>
              <span className="text-xs text-brand-deep/60">
                Farm-Gate Direct Sourcing · 0% Middleman
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-deep">
              {t("buyTitle")}
            </h1>
            <p className="mt-1 text-sm text-brand-deep/70">
              Fresh produce lots available direct from verified farmers across all mandis.
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
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {isAuthenticated && user?.role === "buyer" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                <Store className="size-3.5" />
                {t("loggedAsBuyer")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Contextual Buyer Auth Banner */}
        {!isAuthenticated ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-600/30 bg-amber-50/70 p-3 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-amber-800 shrink-0" />
              <span>
                Commercial trader or retailer? Sign in to unlock verified farmer contact numbers &
                call direct.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => quickLoginDemo("buyer", 0)}
                className="rounded-lg bg-amber-800 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-amber-900"
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
        ) : user?.role === "seller" ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-600/30 bg-emerald-50/80 p-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <Sprout className="size-4 text-emerald-800 shrink-0" />
              <span>
                Signed in as Farmer ({user.name}). Want commercial buyer wholesale access?
              </span>
            </div>
            <button
              type="button"
              onClick={() => switchRole("buyer")}
              className="font-semibold text-emerald-900 hover:underline inline-flex items-center gap-1"
            >
              <ArrowRightLeft className="size-3" />
              Switch to Buyer
            </button>
          </div>
        ) : user ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-600/30 bg-amber-50/60 p-2.5 px-3 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-amber-800" />
              <span>
                Buying as: <strong>{user.businessName}</strong> ({user.name} ·{" "}
                {user.deliveryCity || "Mandi Hub"})
              </span>
            </div>
            <Link
              to="/sell"
              className="text-[11px] font-medium text-amber-900 hover:underline inline-flex items-center gap-1"
            >
              <Sprout className="size-3" />
              Post a harvest instead
            </Link>
          </div>
        ) : null}

        {/* Filter Toolbar: Crop, State, District, and Search */}
        <div className="mt-5 rounded-2xl border border-white/80 bg-white/60 p-3.5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-deep">
            <span className="flex items-center gap-1.5">
              <Filter className="size-3.5 text-brand" />
              Filter Harvest Lots
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-brand hover:underline font-medium"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Crop Filter */}
            <div>
              <label className="block text-[11px] font-medium text-brand-deep/60 mb-1">
                {t("crop")}
              </label>
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/80 px-2.5 py-2 text-xs font-medium text-ink outline-none focus:border-brand"
              >
                <option value="all">All Crops (सभी फसलें)</option>
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {cropName(c.id, lang)}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. State Filter */}
            <div>
              <label className="block text-[11px] font-medium text-brand-deep/60 mb-1">
                {t("state")}
              </label>
              <select
                value={filterState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/80 px-2.5 py-2 text-xs font-medium text-ink outline-none focus:border-brand"
              >
                <option value="all">All States (सभी राज्य)</option>
                {STATES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. District Filter */}
            <div>
              <label className="block text-[11px] font-medium text-brand-deep/60 mb-1">
                {t("district")}
              </label>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                disabled={filterState === "all"}
                className="w-full rounded-xl border border-white/80 bg-white/80 px-2.5 py-2 text-xs font-medium text-ink outline-none focus:border-brand disabled:opacity-50"
              >
                <option value="all">All Districts</option>
                {availableDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Text Search Box */}
            <div>
              <label className="block text-[11px] font-medium text-brand-deep/60 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-brand-deep/40" />
                <input
                  type="text"
                  placeholder="Farmer, mandi, keyword..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-white/80 py-2 pl-8 pr-3 text-xs font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-brand"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Realtime Live Arrival Banner */}
      {latestNewListing && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-50/90 p-3.5 shadow-sm backdrop-blur-xl animate-in slide-in-from-top-2 duration-300">
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

      {/* Marketplace Harvest Listings */}
      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-deep/60">
                Available Farm Lots ({shown.length})
              </p>
              {newListingAlertCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 animate-pulse">
                  +{newListingAlertCount} Live Ingested
                </span>
              )}
            </div>
            <p className="text-[11px] text-brand-deep/50">
              Direct farm-gate harvests synchronized across all buyer devices in real-time
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-900 flex items-center justify-between gap-3">
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

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-brand-deep/20 bg-white/40 p-12 text-center">
            <Sprout className="mx-auto size-10 text-brand-deep/40 mb-3" />
            <p className="font-display text-lg font-semibold text-brand-deep">
              {filterCrop !== "all"
                ? `No listings yet for ${cropName(filterCrop, lang)}`
                : "No farm listings found"}
            </p>
            <p className="mt-1 text-xs text-brand-deep/60 max-w-md mx-auto">
              {hasActiveFilters
                ? "Try clearing your filters or check neighbouring districts to view active harvests."
                : "Be the first farmer to list a harvest on the network today!"}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="rounded-xl border border-brand/30 bg-white px-4 py-2 text-xs font-semibold text-brand hover:bg-brand/10 transition"
                >
                  Clear Filters
                </button>
              )}
              <Link
                to="/sell"
                className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand/90 transition inline-flex items-center gap-1.5"
              >
                <Sprout className="size-3.5" />
                Post Your Harvest Now
              </Link>
            </div>
          </div>
        ) : (
          /* Active Listings Grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
