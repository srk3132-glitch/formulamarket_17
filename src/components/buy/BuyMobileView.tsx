import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n, cropName } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import {
  Store,
  Search,
  X,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sprout,
  ArrowRight,
  ArrowRightLeft,
  RefreshCw,
} from "lucide-react";

export default function BuyMobileView() {
  const { t, lang } = useI18n();
  const { region, placeName, districtName, stateName } = useRegion();
  const {
    listings,
    isLoading,
    refreshListings,
    latestNewListing,
    clearLatestListing,
  } = useListings();
  const { user, isAuthenticated, switchRole, quickLoginDemo } = useAuth();

  const [filterQuery, setFilterQuery] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const inRegion = listings.filter((l) => l.stateId === region.stateId);
  const baseListings = inRegion.length > 0 ? inRegion : listings;

  const shown = baseListings.filter((l) => {
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
    <div className="flex flex-col gap-4 px-3.5 pt-3 pb-8">
      {/* Realtime Live Arrival Banner */}
      {latestNewListing && (
        <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-50/90 p-3 shadow-xs animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600"></span>
            </span>
            <div>
              <p className="text-[11px] font-bold text-emerald-950">
                ⚡ Just Listed: {latestNewListing.farmer} posted {latestNewListing.quantity}q of {cropName(latestNewListing.cropId, lang)}!
              </p>
              <p className="text-[10px] text-emerald-900/70">
                {latestNewListing.placeName} · Synced live
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearLatestListing}
            className="rounded-lg bg-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <section className="rounded-2xl border border-amber-600/20 bg-white/80 p-4 shadow-xs backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-950">
            <Store className="size-3.5" />
            Procurement Marketplace
          </span>
          <button
            type="button"
            onClick={() => refreshListings()}
            disabled={isLoading}
            className="inline-flex items-center gap-1 rounded-lg border border-brand/20 bg-white/90 px-2 py-1 text-[11px] font-bold text-brand"
          >
            <RefreshCw className={`size-3 text-brand ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <h1 className="mt-2 font-display text-xl font-bold text-brand-deep">
          {t("buyTitle")}
        </h1>
        <p className="text-xs text-brand-deep/70">
          Fresh harvests near <strong>{placeName}</strong> ({districtName})
        </p>

        {/* Change Location Button */}
        <button
          type="button"
          onClick={() => setShowLocationPicker((prev) => !prev)}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-brand/20 bg-brand/5 px-3.5 py-2.5 text-xs font-bold text-brand min-h-[44px]"
        >
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5" />
            <span>Market: {placeName}, {districtName}</span>
          </div>
          {showLocationPicker ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>

        {showLocationPicker && (
          <div className="mt-3 pt-3 border-t border-brand-deep/10">
            <RegionSelector layout="vertical" />
          </div>
        )}
      </section>

      {/* Buyer Quick Auth Banner */}
      {!isAuthenticated ? (
        <div className="rounded-2xl border border-amber-600/30 bg-amber-50/90 p-3.5 text-xs text-amber-950">
          <div className="flex items-center justify-between">
            <span className="font-bold">Commercial Buyer Access</span>
            <span className="rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-bold">
              1-Click Ready
            </span>
          </div>
          <p className="mt-1 text-[11px] text-amber-900/80">
            Sign in as wholesale buyer to lock in lots with direct farmer contacts.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => quickLoginDemo("buyer", 0)}
              className="flex-1 min-h-[40px] rounded-xl bg-amber-800 py-2 text-center text-xs font-bold text-white shadow-xs"
            >
              ⚡ Instant Buyer Sign In
            </button>
            <Link
              to="/login"
              search={{ role: "buyer" }}
              className="min-h-[40px] px-3 flex items-center text-xs font-bold text-amber-900 underline"
            >
              Portal →
            </Link>
          </div>
        </div>
      ) : user?.role === "seller" ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-600/30 bg-emerald-50/80 p-3 text-xs text-emerald-950">
          <span className="truncate min-w-0 flex-1">Farmer: {user.name}</span>
          <button
            type="button"
            onClick={() => switchRole("buyer")}
            className="font-bold text-emerald-900 underline shrink-0 min-h-[32px] px-2"
          >
            Switch to Buyer
          </button>
        </div>
      ) : null}

      {/* Sticky Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-brand-deep/40" />
        <input
          type="search"
          inputMode="search"
          placeholder="Search crop or farmer name..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full min-h-[48px] rounded-2xl border border-brand-deep/20 bg-white/90 py-3 pl-10 pr-9 text-base font-semibold text-brand-deep placeholder:text-brand-deep/40 placeholder:font-normal outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 shadow-xs transition"
        />
        {filterQuery && (
          <button
            type="button"
            onClick={() => setFilterQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid size-8 place-items-center text-brand-deep/50"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Produce Listings */}
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-deep/60 px-1">
          Available Farm Lots ({shown.length})
        </p>

        {shown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-amber-600/30 bg-white/50 p-8 text-center backdrop-blur-xl">
            <p className="font-display text-base font-bold text-brand-deep">
              No lots match your search
            </p>
            <p className="mt-1 text-xs text-brand-deep/60">
              Try searching a different crop or clearing the search query.
            </p>
            <button
              type="button"
              onClick={() => setFilterQuery("")}
              className="mt-3 min-h-[44px] rounded-xl bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-xs"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {shown.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
