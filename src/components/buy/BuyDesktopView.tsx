import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { InterfaceModeNav } from "@/components/InterfaceModeNav";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import { useI18n, cropName } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import { Store, Sprout, ArrowRightLeft, Building2, Search, Filter, ArrowRight } from "lucide-react";

export default function BuyDesktopView() {
  const { t, lang } = useI18n();
  const { region, placeName, districtName, stateName } = useRegion();
  const { listings } = useListings();
  const { user, isAuthenticated, switchRole, quickLoginDemo } = useAuth();
  const [filterQuery, setFilterQuery] = useState("");

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

          {isAuthenticated && user?.role === "buyer" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              <Store className="size-3.5" />
              {t("loggedAsBuyer")}
            </span>
          ) : null}
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
          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/60 p-3 shadow-xs backdrop-blur-xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                Available Farm Lots ({shown.length})
              </p>
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

          {shown.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-deep/20 bg-white/40 p-10 text-center">
              <p className="font-display text-lg font-semibold text-brand-deep">
                No lots match your search
              </p>
              <p className="mt-1 text-xs text-brand-deep/60">
                Try clearing the search query or select a neighbouring district.
              </p>
              <button
                type="button"
                onClick={() => setFilterQuery("")}
                className="mt-3 rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white"
              >
                Clear Search
              </button>
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
