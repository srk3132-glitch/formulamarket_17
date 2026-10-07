import { createFileRoute, Link } from "@tanstack/react-router";
import { PriceBoard } from "@/components/PriceBoard";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import { useI18n, cropName } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import { Store, Sprout, ArrowRightLeft, Building2, Search, Sparkles, Radio, Bell } from "lucide-react";
import { InterfaceModeNav } from "@/components/InterfaceModeNav";
import { SupabaseConnectionBar } from "@/components/SupabaseConnectionBar";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy Direct From Farmers — Formula Market" },
      {
        name: "description",
        content:
          "Browse fresh harvests listed by farmers across Tamil Nadu, Andhra Pradesh, Telangana and Kerala, with live mandi prices for reference.",
      },
      { property: "og:title", content: "Buy Direct From Farmers — Formula Market" },
      {
        property: "og:description",
        content:
          "Fresh produce listed straight from the field, with today's mandi rates alongside.",
      },
    ],
  }),
  component: BuyPage,
});

function BuyPage() {
  const { t, lang } = useI18n();
  const { region, placeName, districtName, stateName } = useRegion();
  const { listings, latestNewListing, newListingAlertCount, clearLatestListing } = useListings();
  const { user, isAuthenticated, switchRole, quickLoginDemo } = useAuth();
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    if (latestNewListing) {
      toast.success(
        `🌾 Live Harvest: ${latestNewListing.farmer} listed ${latestNewListing.quantity} quintals of ${cropName(latestNewListing.cropId, lang)}!`,
        { duration: 5000 },
      );
    }
  }, [latestNewListing, lang]);

  const inRegion = listings.filter((l) => l.stateId === region.stateId);
  const baseListings = inRegion.length > 0 ? inRegion : listings;

  const shown = baseListings.filter((l) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      l.cropId.toLowerCase().includes(q) ||
      l.farmer.toLowerCase().includes(q) ||
      l.placeName.toLowerCase().includes(q)
    );
  });

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-8">
      {/* Interface Mode Switcher */}
      <InterfaceModeNav currentMode="buy" />

      {/* Supabase Realtime Database Status Bar */}
      <SupabaseConnectionBar />

      <section className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
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
              Fresh produce lots available near <strong>{placeName}</strong> ({districtName},{" "}
              {stateName}).
            </p>
          </div>

          {isAuthenticated && user?.role === "buyer" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              <Store className="size-3.5" />
              {t("loggedAsBuyer")}
            </span>
          ) : null}
        </div>

        {/* Contextual Buyer Auth Banner with 1-Click Instant Sign In */}
        {!isAuthenticated ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-600/30 bg-amber-50/70 p-3 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-amber-800 shrink-0" />
              <span>
                Commercial trader or retailer? Sign in as a Buyer to lock in lots with direct farmer
                contacts.
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
              to="/login"
              search={{ role: "buyer" }}
              className="text-[11px] font-medium text-amber-900 hover:underline"
            >
              {t("switchAccount")}
            </Link>
          </div>
        ) : null}

        <div className="mt-5 rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">
          <RegionSelector />
        </div>
      </section>

      {/* Live Benchmark Reference Banner */}
      <section className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-600/30 bg-teal-50/70 p-4 text-xs backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl bg-teal-700 text-white">📊</div>
          <div>
            <p className="font-semibold text-teal-950">
              Live Mandi Price Benchmark Active ({placeName})
            </p>
            <p className="text-[11px] text-teal-900/70">
              Check real-time APMC min, max and modal rates across 111 South Indian districts before
              procuring.
            </p>
          </div>
        </div>
        <Link
          to="/rates"
          className="inline-flex items-center gap-1.5 rounded-xl bg-teal-800 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-900"
        >
          <span>Open Live Mandi Interface</span>
          <span>→</span>
        </Link>
      </section>

      {/* Realtime Live Arrival Banner */}
      {latestNewListing && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/50 bg-emerald-50/90 p-3.5 text-xs text-emerald-950 backdrop-blur-xl shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-emerald-600"></span>
            </span>
            <div>
              <p className="font-semibold text-emerald-950">
                ⚡ Just Listed in Real-Time: {latestNewListing.farmer} posted {latestNewListing.quantity} quintal(s) of {cropName(latestNewListing.cropId, lang)}!
              </p>
              <p className="text-[11px] text-emerald-900/70">
                Location: {latestNewListing.placeName} · Instant farm-gate contact available below.
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
              Direct farm-gate harvests with verified farmer contact numbers
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 size-3.5 text-brand-deep/40" />
            <input
              type="text"
              placeholder="Search harvest crop or farmer..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full rounded-xl border border-white/80 bg-white/70 py-1.5 pl-8 pr-3 text-xs font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-amber-700 focus:bg-white transition"
            />
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-deep/20 bg-white/40 p-10 text-center">
            <p className="font-display text-lg font-semibold text-brand-deep">
              No lots match your search
            </p>
            <p className="mt-1 text-xs text-brand-deep/60">
              Try clearing the search query or select a neighbouring district above.
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
