import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PriceBoard } from "@/components/PriceBoard";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import { useI18n } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import paddyImg from "@/assets/paddy-dawn.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Formula Market — Live Mandi Prices for Farmers" },
      {
        name: "description",
        content:
          "Real-time mandi prices by state, district and market, in English, Tamil, Telugu and Malayalam. Farmers list produce; buyers purchase direct.",
      },
      { property: "og:title", content: "Formula Market — Live Mandi Prices for Farmers" },
      {
        property: "og:description",
        content:
          "Check live crop prices for your region and sell your harvest direct to buyers, in your own language.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  const { placeName, districtName } = useRegion();
  const { listings } = useListings();
  const navigate = useNavigate();

  const nearby = listings.slice(0, 3);

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="flex flex-col justify-between rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-semibold text-brand-deep/80 backdrop-blur-xl">
              <span className="livedot inline-block size-2 rounded-full bg-accent" />
              {t("liveBadge")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-deep lg:text-[44px]">
              {t("heroA")}
              <br />
              <span className="text-brand">{t("heroB")}</span> {t("heroC")}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-brand-deep/70">
              {t("heroSub")}
            </p>
          </div>

          <div className="mt-7 rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep/60">
              {t("whereSelling")}
            </p>
            <RegionSelector />
            <button
              type="button"
              onClick={() => navigate({ to: "/rates" })}
              className="mt-3 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90"
            >
              {t("viewPrices")}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <img
            src={paddyImg}
            alt="Paddy fields at dawn"
            width={1080}
            height={720}
            className="min-h-[220px] w-full flex-1 rounded-3xl object-cover shadow-[var(--shadow-glass-sm)]"
          />
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/60 bg-white/45 p-4 backdrop-blur-2xl">
              <p className="font-display text-2xl font-semibold text-brand-deep">111</p>
              <p className="mt-0.5 text-[11px] font-medium text-brand-deep/60">
                Districts across 4 States
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/45 p-4 backdrop-blur-2xl">
              <p className="font-display text-2xl font-semibold text-brand-deep">39</p>
              <p className="mt-0.5 text-[11px] font-medium text-brand-deep/60">
                Live APMC Commodities
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/45 p-4 backdrop-blur-2xl">
              <p className="font-display text-2xl font-semibold text-brand-deep">0%</p>
              <p className="mt-0.5 text-[11px] font-medium text-brand-deep/60">Broker Commission</p>
            </div>
          </div>
        </section>
      </div>

      {/* 3 Dedicated Interface Portals: Live Rates, Sell Harvest, Buy Produce */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-brand-deep">
              Choose Your Dedicated Interface
            </h2>
            <p className="text-xs text-brand-deep/70">
              Separate purpose-built workflows for live APMC rates, farmer crop listing, and
              wholesale buying.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* 1. Live Mandi Rates Interface */}
          <div className="group flex flex-col justify-between rounded-3xl border border-brand/30 bg-white/55 p-6 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition hover:border-brand hover:shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  <span className="size-2 rounded-full bg-accent animate-pulse" />
                  Live APMC Rates
                </span>
                <span className="text-[11px] font-medium text-brand-deep/60">111 Districts</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-brand-deep">
                Real-Time Mandi Rates
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-brand-deep/70">
                Live modal prices, min-max spreads, and 24h trends for 39 crops in AP, Telangana,
                Tamil Nadu & Kerala.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-brand-deep/10">
              <Link
                to="/rates"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand/90"
              >
                <span>Open Rates Board</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* 2. Selling / Listing Harvest Interface */}
          <div className="group flex flex-col justify-between rounded-3xl border border-emerald-600/30 bg-white/55 p-6 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition hover:border-emerald-600 hover:shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  Farmer Portal
                </span>
                <span className="text-[11px] font-medium text-emerald-800">0% Commission</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-emerald-950">
                List Your Harvest
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-brand-deep/70">
                Direct selling interface for farmers. Benchmark your crop with today's APMC modal
                rates and publish lot.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-brand-deep/10">
              <Link
                to="/sell"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>Post Harvest Lot</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* 3. Buying / Procurement Marketplace */}
          <div className="group flex flex-col justify-between rounded-3xl border border-amber-600/30 bg-white/55 p-6 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition hover:border-amber-600 hover:shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950">
                  <span className="size-2 rounded-full bg-amber-600" />
                  Buyer Portal
                </span>
                <span className="text-[11px] font-medium text-amber-800">
                  Wholesale Procurement
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-amber-950">
                Buy Produce Direct
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-brand-deep/70">
                Browse freshly harvested crop lots from verified farmers, compare with mandi
                benchmarks and call direct.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-brand-deep/10">
              <Link
                to="/buy"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-900"
              >
                <span>Browse Produce Market</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Portal Selection: Farmer vs Buyer Fast Sign In */}
      <section className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Farmer Sign In Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-emerald-600/20 bg-white/40 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition hover:border-emerald-600/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900">
                🌾 {t("farmerBadge")} Fast Sign In
              </span>
              <span className="text-[11px] text-emerald-800/70">Instant 1-Click Access</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-brand-deep/70">
              Sign in as farmer in 1 click or enter your 10-digit mobile number for instant OTP
              verification.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <Link
                to="/login"
                search={{ role: "seller" }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700/90 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>{t("farmerSignIn")}</span>
                <span>→</span>
              </Link>
              <Link to="/sell" className="text-xs font-medium text-emerald-800 hover:underline">
                {t("navSell")} →
              </Link>
            </div>
          </div>

          {/* Buyer Sign In Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-amber-600/20 bg-white/40 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition hover:border-amber-600/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-950">
                🛒 {t("buyerBadge")} Fast Sign In
              </span>
              <span className="text-[11px] text-amber-800/70">Instant 1-Click Access</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-brand-deep/70">
              Sign in as verified buyer or trader to reserve harvests, contact farmers, and track
              rates.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <Link
                to="/login"
                search={{ role: "buyer" }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-800/90 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-900"
              >
                <span>{t("buyerSignIn")}</span>
                <span>→</span>
              </Link>
              <Link to="/buy" className="text-xs font-medium text-amber-900 hover:underline">
                {t("navBuy")} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PriceBoard limit={6} />

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-brand-deep">
              {t("buyTitle")}
            </h2>
            <p className="text-xs text-brand-deep/60">
              {t("buySub")} · {placeName}, {districtName}
            </p>
          </div>
          <Link to="/buy" className="text-sm font-semibold text-brand hover:underline">
            {t("seeAll")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </main>
  );
}
