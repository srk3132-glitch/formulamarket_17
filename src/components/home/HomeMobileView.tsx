import { Link, useNavigate } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import { PriceBoard } from "@/components/PriceBoard";
import {
  TrendingUp,
  Sprout,
  Store,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HomeMobileView() {
  const { t } = useI18n();
  const { placeName, districtName } = useRegion();
  const { listings } = useListings();
  const navigate = useNavigate();

  const nearby = listings.slice(0, 3);

  return (
    <div className="flex flex-col gap-5 px-3.5 pt-3 pb-8">
      {/* 1. Compact Hero with Outdoor Sunlight Contrast */}
      <section className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-900">
            <span className="livedot inline-block size-2 rounded-full bg-teal-600" />
            {t("liveBadge")}
          </span>
          <span className="text-[11px] font-semibold text-brand-deep/70">
            APMC Real-Time
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-brand-deep">
          {t("heroA")}{" "}
          <span className="text-brand underline decoration-accent/60 underline-offset-4">
            {t("heroB")}
          </span>{" "}
          {t("heroC")}
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-brand-deep/80 font-medium">
          {t("heroSub")}
        </p>

        {/* 2. "Where are you selling?" Full-Width Selector */}
        <div className="mt-5 rounded-2xl border border-brand/20 bg-brand/5 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-deep">
            📍 {t("whereSelling")}
          </p>
          <RegionSelector layout="vertical" />
          <button
            type="button"
            onClick={() => navigate({ to: "/rates" })}
            className="mt-4 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-white shadow-md active:scale-98 transition"
          >
            <span>{t("viewPrices")}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* 3. Stats as 3 Compact Tiles / Swipeable Row */}
      <section className="grid grid-cols-3 gap-2 text-center" aria-label="Key marketplace stats">
        <div className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-xs">
          <p className="font-display text-xl font-bold text-brand-deep">111</p>
          <p className="mt-0.5 text-[10px] font-semibold leading-tight text-brand-deep/70">
            Districts
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-xs">
          <p className="font-display text-xl font-bold text-brand-deep">39</p>
          <p className="mt-0.5 text-[10px] font-semibold leading-tight text-brand-deep/70">
            Commodities
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-xs">
          <p className="font-display text-xl font-bold text-emerald-800">0%</p>
          <p className="mt-0.5 text-[10px] font-semibold leading-tight text-brand-deep/70">
            Commission
          </p>
        </div>
      </section>

      {/* 4. Dedicated Interface Cards (Stacked, 44px+ touch targets) */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-deep/60 px-1">
          Quick Portals
        </p>

        {/* Live Mandi Rates */}
        <Link
          to="/rates"
          className="flex items-center justify-between rounded-2xl border border-teal-600/30 bg-teal-50/80 p-4 shadow-xs active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-teal-700 text-white shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-teal-950">
                Live Mandi Price Rates
              </p>
              <p className="text-[11px] text-teal-800/80 font-medium">
                Check 39 crop modal prices in {placeName}
              </p>
            </div>
          </div>
          <ArrowRight className="size-5 text-teal-800 shrink-0" />
        </Link>

        {/* Sell Harvest */}
        <Link
          to="/sell"
          className="flex items-center justify-between rounded-2xl border border-emerald-600/30 bg-emerald-50/80 p-4 shadow-xs active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-emerald-700 text-white shrink-0">
              <Sprout className="size-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-emerald-950">
                Farmer Direct Portal
              </p>
              <p className="text-[11px] text-emerald-800/80 font-medium">
                List produce · 0% commission
              </p>
            </div>
          </div>
          <ArrowRight className="size-5 text-emerald-800 shrink-0" />
        </Link>

        {/* Buy Produce */}
        <Link
          to="/buy"
          className="flex items-center justify-between rounded-2xl border border-amber-600/30 bg-amber-50/80 p-4 shadow-xs active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-amber-800 text-white shrink-0">
              <Store className="size-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-amber-950">
                Wholesale Buyer Portal
              </p>
              <p className="text-[11px] text-amber-800/80 font-medium">
                Buy direct from verified local farmers
              </p>
            </div>
          </div>
          <ArrowRight className="size-5 text-amber-800 shrink-0" />
        </Link>
      </section>

      {/* 5. Stacked Fast Sign-In Cards */}
      <section className="flex flex-col gap-2.5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-deep/60 px-1">
          Instant Sign In
        </p>
        <div className="rounded-2xl border border-emerald-600/30 bg-white/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">
              🌾 {t("farmerBadge")} Fast Sign In
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
              1-Click Demo
            </span>
          </div>
          <p className="mt-1 text-xs text-brand-deep/70">
            Sign in as Ramesh Patel or enter mobile number for instant OTP.
          </p>
          <Link
            to="/login"
            search={{ role: "seller" }}
            className="mt-3 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs"
          >
            <span>{t("farmerSignIn")}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-amber-600/30 bg-white/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">
              🛒 {t("buyerBadge")} Fast Sign In
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-900">
              1-Click Demo
            </span>
          </div>
          <p className="mt-1 text-xs text-brand-deep/70">
            Sign in as Sri Krishna Traders to reserve harvest lots.
          </p>
          <Link
            to="/login"
            search={{ role: "buyer" }}
            className="mt-3 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-amber-800 py-2.5 text-xs font-bold text-white shadow-xs"
          >
            <span>{t("buyerSignIn")}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. Live Rates Preview Board */}
      <PriceBoard limit={4} />

      {/* 7. Nearby Produce Listings */}
      <section className="mt-2">
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <h2 className="font-display text-base font-bold text-brand-deep">
              {t("buyTitle")}
            </h2>
            <p className="text-[11px] text-brand-deep/60">
              Near {placeName}, {districtName}
            </p>
          </div>
          <Link
            to="/buy"
            className="text-xs font-bold text-brand hover:underline min-h-[44px] flex items-center"
          >
            {t("seeAll")}
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {nearby.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
