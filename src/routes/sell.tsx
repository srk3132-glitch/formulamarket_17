import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import { CROPS, cropName, useI18n } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import { buildPrices, formatRupees } from "@/lib/prices";
import { Sprout, Store, ArrowRightLeft, ShieldCheck, Radio, CheckCircle2, Loader2 } from "lucide-react";
import { InterfaceModeNav } from "@/components/InterfaceModeNav";
import { SupabaseConnectionBar } from "@/components/SupabaseConnectionBar";
import { toast } from "sonner";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "List Your Harvest — Formula Market" },
      {
        name: "description",
        content:
          "Farmers: choose your state, district and market, set your price against today's mandi rate, and let buyers contact you directly.",
      },
      { property: "og:title", content: "List Your Harvest — Formula Market" },
      {
        property: "og:description",
        content: "Post your produce by region and sell direct to buyers, with no middleman.",
      },
    ],
  }),
  component: SellPage,
});

const inputClass =
  "w-full rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 text-sm font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-brand/50";

function SellPage() {
  const { t, lang } = useI18n();
  const { region, placeName } = useRegion();
  const { listings, addListing } = useListings();
  const { user, isAuthenticated, switchRole, quickLoginDemo } = useAuth();

  const [cropId, setCropId] = useState<string>("tomato");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [farmer, setFarmer] = useState(user?.role === "seller" ? user.name : "");
  const [phone, setPhone] = useState(user?.role === "seller" ? user.phone : "");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === "seller") {
      setFarmer(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const reference = buildPrices(region.placeId, 0).find((r) => r.cropId === cropId);
  const mine = listings.filter(
    (l) => l.id.startsWith("u") || l.id.startsWith("lst_") || (farmer && l.farmer === farmer),
  );

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-8">
      {/* Interface Mode Switcher */}
      <InterfaceModeNav currentMode="sell" />

      {/* Supabase Realtime Database Status Bar */}
      <SupabaseConnectionBar />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <Sprout className="size-3.5" />
                  Farmer Direct Portal
                </span>
                <span className="text-xs text-brand-deep/60">
                  0% Commission · Direct Buyer Calls
                </span>
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-deep">
                {t("sellTitle")}
              </h1>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-brand-deep/70">
                {t("sellSub")}
              </p>
            </div>
            {isAuthenticated && user?.role === "seller" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Sprout className="size-3.5" />
                {t("loggedAsFarmer")}
              </span>
            ) : null}
          </div>

          {/* Contextual Auth Banner with 1-Click Instant Sign In */}
          {!isAuthenticated ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-600/20 bg-emerald-50/70 p-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <Sprout className="size-4 text-emerald-700 shrink-0" />
                <span>Sign in as a Farmer to save your details & manage harvests.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => quickLoginDemo("seller", 0)}
                  className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  ⚡ Instant Sign In
                </button>
                <Link
                  to="/login"
                  search={{ role: "seller", redirect: "/sell" }}
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Full Portal →
                </Link>
              </div>
            </div>
          ) : user?.role === "buyer" ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-600/30 bg-amber-50/80 p-3 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Store className="size-4 text-amber-800 shrink-0" />
                <span>
                  You are signed in as Buyer ({user.businessName}). Switch to sell produce.
                </span>
              </div>
              <button
                type="button"
                onClick={() => switchRole("seller")}
                className="font-semibold text-amber-900 hover:underline inline-flex items-center gap-1"
              >
                <ArrowRightLeft className="size-3" />
                Switch to Farmer
              </button>
            </div>
          ) : user ? (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-600/20 bg-emerald-50/50 p-2.5 px-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-700" />
                <span>
                  Listing as: <strong>{user.name}</strong> ({user.farmName || "Farm"})
                </span>
              </div>
              <Link
                to="/login"
                search={{ role: "seller" }}
                className="text-[11px] font-medium text-emerald-700 hover:underline"
              >
                {t("switchAccount")}
              </Link>
            </div>
          ) : null}

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await addListing({
                  cropId,
                  quantity: Number(quantity) || 1,
                  price: Number(price) || (reference?.modal ?? 0),
                  farmer: farmer || "Farmer",
                  phone: phone || "+91",
                  stateId: region.stateId,
                  districtId: region.districtId,
                  placeId: region.placeId,
                  placeName,
                });
                setDone(true);
                setQuantity("");
                setPrice("");
                toast.success(
                  "🌾 Harvest published live! All buyers across the network can see this in real-time.",
                  { duration: 5000 },
                );
              } catch (err) {
                toast.error("Failed to post listing. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                {t("crop")}
              </span>
              <select
                className={inputClass}
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
              >
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {cropName(c.id, lang)}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep/60">
                {t("whereSelling")}
              </p>
              <RegionSelector />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                  {t("quantity")}
                </span>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="5"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                  {t("askPrice")}
                </span>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={reference ? String(reference.modal) : "2000"}
                  required
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                  {t("yourName")}
                </span>
                <input
                  className={inputClass}
                  value={farmer}
                  onChange={(e) => setFarmer(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
                  {t("phone")}
                </span>
                <input
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400 00000"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Publishing to Realtime Feed...</span>
                </>
              ) : (
                <>
                  <Radio className="size-4" />
                  <span>{t("postListing")}</span>
                </>
              )}
            </button>
            {done ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50/80 px-3.5 py-2.5 text-xs font-semibold text-emerald-900 shadow-2xs">
                <CheckCircle2 className="size-4 text-emerald-700 shrink-0" />
                <span>Harvest published live! Synced across all buyer screens in real-time.</span>
              </div>
            ) : null}
          </form>
        </section>

        <section className="flex flex-col gap-4">
          {reference ? (
            <div className="rounded-3xl border border-white/60 bg-white/45 p-6 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep/60">
                {t("ratesTitle")} · {placeName}
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-brand-deep">
                {formatRupees(reference.modal)}
                <span className="text-xs font-normal text-brand-deep/50"> /{t("quintal")}</span>
              </p>
              <p className="mt-1 text-sm text-brand-deep/60">
                {formatRupees(reference.min)} – {formatRupees(reference.max)}
              </p>
            </div>
          ) : null}

          {mine.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </section>
      </div>
    </main>
  );
}
