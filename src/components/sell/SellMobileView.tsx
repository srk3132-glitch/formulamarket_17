import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { CROPS, cropName, useI18n } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { useListings } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import { buildPrices, formatRupees } from "@/lib/prices";
import { RegionSelector } from "@/components/RegionSelector";
import { ListingCard } from "@/components/ListingCard";
import {
  Sprout,
  Store,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function SellMobileView() {
  const { t, lang } = useI18n();
  const { region, placeName } = useRegion();
  const { listings, addListing } = useListings();
  const { user, isAuthenticated, switchRole, quickLoginDemo } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cropId, setCropId] = useState<string>("tomato");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [farmer, setFarmer] = useState(user?.role === "seller" ? user.name : "");
  const [phone, setPhone] = useState(user?.role === "seller" ? user.phone : "");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user?.role === "seller") {
      setFarmer(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const reference = buildPrices(region.placeId, 0).find((r) => r.cropId === cropId);
  const mine = listings.filter((l) => l.id.startsWith("u"));

  const handleNextFromStep1 = () => {
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!quantity || !price) return;
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addListing({
      cropId,
      quantity: Number(quantity) || 1,
      price: Number(price) || (reference?.modal ?? 2000),
      farmer: farmer || "Farmer",
      phone: phone || "+91 98400 00000",
      stateId: region.stateId,
      districtId: region.districtId,
      placeId: region.placeId,
      placeName,
    });
    setSubmitted(true);
    setStep(1);
    setQuantity("");
    setPrice("");
  };

  return (
    <div className="flex flex-col gap-4 px-3.5 pt-3 pb-8">
      {/* Header */}
      <section className="rounded-2xl border border-emerald-600/20 bg-white/80 p-4 shadow-xs backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
            <Sprout className="size-3.5" />
            Farmer Direct Portal
          </span>
          <span className="text-[10px] text-emerald-800 font-bold">0% Commission</span>
        </div>

        <h1 className="mt-2 font-display text-xl font-bold text-brand-deep">
          {t("sellTitle")}
        </h1>
        <p className="text-xs text-brand-deep/70">
          Sell harvest direct to verified buyers near {placeName}.
        </p>
      </section>

      {/* Quick Farmer Auth Banner */}
      {!isAuthenticated ? (
        <div className="rounded-2xl border border-emerald-600/30 bg-emerald-50/90 p-3.5 text-xs text-emerald-950">
          <div className="flex items-center justify-between">
            <span className="font-bold">Farmer Profile Access</span>
            <span className="rounded bg-emerald-200/80 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900">
              1-Click Ready
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-900/80">
            Sign in as Ramesh Patel to auto-fill contact details and manage listings.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => quickLoginDemo("seller", 0)}
              className="flex-1 min-h-[40px] rounded-xl bg-emerald-700 py-2 text-center text-xs font-bold text-white shadow-xs"
            >
              ⚡ Instant Farmer Sign In
            </button>
            <Link
              to="/login"
              search={{ role: "seller" }}
              className="min-h-[40px] px-3 flex items-center text-xs font-bold text-emerald-900 underline"
            >
              Portal →
            </Link>
          </div>
        </div>
      ) : user?.role === "seller" ? (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-600/20 bg-emerald-50/70 p-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-700" />
            <span>
              Listing as: <strong>{user.name}</strong> ({user.farmName || "Farm"})
            </span>
          </div>
        </div>
      ) : null}

      {/* Step Progress Indicator (1 -> 2 -> 3) */}
      <div className="rounded-2xl border border-white/80 bg-white/70 p-3 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-brand-deep">
          <div className="flex items-center gap-1.5">
            <span
              className={`grid size-6 place-items-center rounded-full text-[11px] ${
                step >= 1 ? "bg-emerald-700 text-white" : "bg-black/10 text-brand-deep/50"
              }`}
            >
              1
            </span>
            <span className={step === 1 ? "text-emerald-950" : "text-brand-deep/50"}>
              Crop & Mandi
            </span>
          </div>

          <div className="h-0.5 w-6 bg-brand-deep/15" />

          <div className="flex items-center gap-1.5">
            <span
              className={`grid size-6 place-items-center rounded-full text-[11px] ${
                step >= 2 ? "bg-emerald-700 text-white" : "bg-black/10 text-brand-deep/50"
              }`}
            >
              2
            </span>
            <span className={step === 2 ? "text-emerald-950" : "text-brand-deep/50"}>
              Qty & Price
            </span>
          </div>

          <div className="h-0.5 w-6 bg-brand-deep/15" />

          <div className="flex items-center gap-1.5">
            <span
              className={`grid size-6 place-items-center rounded-full text-[11px] ${
                step >= 3 ? "bg-emerald-700 text-white" : "bg-black/10 text-brand-deep/50"
              }`}
            >
              3
            </span>
            <span className={step === 3 ? "text-emerald-950" : "text-brand-deep/50"}>
              Confirm
            </span>
          </div>
        </div>
      </div>

      {/* Submission Success Alert */}
      {submitted && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-600/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-950 animate-in fade-in">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">{t("posted")}</p>
            <p className="text-[11px] text-emerald-800">
              Buyers in {placeName} and surrounding mandis can now view your produce.
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Choose Crop & Mandi */}
      {step === 1 && (
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-xl animate-in fade-in">
          <h2 className="font-display text-base font-bold text-brand-deep">
            Step 1: Choose Crop & Market
          </h2>
          <p className="mt-0.5 text-xs text-brand-deep/60">
            Select what you are harvesting and where buyers can collect it.
          </p>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                {t("crop")}
              </span>
              <select
                className="w-full min-h-[48px] appearance-none rounded-xl border border-brand-deep/20 bg-white px-3.5 py-3 text-base font-semibold text-brand-deep shadow-xs outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 cursor-pointer"
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
              >
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {cropName(c.id, lang)} ({c.en})
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl border border-brand-deep/15 bg-white/60 p-3.5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                📍 {t("whereSelling")}
              </p>
              <RegionSelector layout="vertical" />
            </div>

            {reference && (
              <div className="rounded-xl border border-teal-600/20 bg-teal-50/70 p-3 text-xs text-teal-950 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-teal-800">
                    Today's Mandi Benchmark ({placeName})
                  </p>
                  <p className="font-display font-bold text-sm text-teal-950 mt-0.5">
                    {formatRupees(reference.modal)} /{t("quintal")}
                  </p>
                </div>
                <TrendingUp className="size-4 text-teal-700" />
              </div>
            )}

            <button
              type="button"
              onClick={handleNextFromStep1}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md active:scale-98 transition"
            >
              <span>Continue to Quantity & Price</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Quantity & Asking Price */}
      {step === 2 && (
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-xl animate-in fade-in">
          <h2 className="font-display text-base font-bold text-brand-deep">
            Step 2: Harvest Quantity & Price
          </h2>
          <p className="mt-0.5 text-xs text-brand-deep/60">
            For {cropName(cropId, lang)} in {placeName}.
          </p>

          <div className="mt-4 space-y-4">
            {reference && (
              <div className="rounded-2xl border border-teal-600/30 bg-teal-50/80 p-3.5 text-xs">
                <span className="font-bold text-teal-950">
                  APMC Modal Benchmark: {formatRupees(reference.modal)} / quintal
                </span>
                <p className="text-[11px] text-teal-900/70 mt-0.5">
                  Today's range: {formatRupees(reference.min)} – {formatRupees(reference.max)}
                </p>
              </div>
            )}

            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                {t("quantity")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="e.g. 10 quintals"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-brand-deep/20 bg-white px-3.5 py-3 text-base font-semibold text-brand-deep shadow-xs outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                {t("askPrice")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                placeholder={reference ? String(reference.modal) : "2500"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-brand-deep/20 bg-white px-3.5 py-3 text-base font-semibold text-brand-deep shadow-xs outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                required
              />
            </label>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-1 min-h-[48px] px-4 rounded-xl border border-brand-deep/20 bg-white text-xs font-bold text-brand-deep"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                disabled={!quantity || !price}
                className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md disabled:opacity-50 active:scale-98 transition"
              >
                <span>Continue to Farmer Info</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Farmer Name & Phone */}
      {step === 3 && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[var(--shadow-glass-sm)] backdrop-blur-xl animate-in fade-in"
        >
          <h2 className="font-display text-base font-bold text-brand-deep">
            Step 3: Confirm & Publish Lot
          </h2>
          <p className="mt-0.5 text-xs text-brand-deep/60">
            Buyers will dial this phone number directly.
          </p>

          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-emerald-600/20 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 space-y-1">
              <p>
                <strong>Produce:</strong> {cropName(cropId, lang)} · {quantity} {t("quintals")}
              </p>
              <p>
                <strong>Price:</strong> {formatRupees(Number(price))} / quintal
              </p>
              <p>
                <strong>Mandi Location:</strong> {placeName}
              </p>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                {t("yourName")}
              </span>
              <input
                type="text"
                placeholder="Ramesh Patel"
                value={farmer}
                onChange={(e) => setFarmer(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-brand-deep/20 bg-white px-3.5 py-3 text-base font-semibold text-brand-deep shadow-xs outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                {t("phone")}
              </span>
              <input
                type="tel"
                inputMode="tel"
                placeholder="+91 98400 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-brand-deep/20 bg-white px-3.5 py-3 text-base font-semibold text-brand-deep shadow-xs outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                required
              />
            </label>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center justify-center gap-1 min-h-[48px] px-4 rounded-xl border border-brand-deep/20 bg-white text-xs font-bold text-brand-deep"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md active:scale-98 transition"
              >
                <CheckCircle2 className="size-4" />
                <span>{t("postListing")}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Farmer's Active Listings */}
      {mine.length > 0 && (
        <section className="mt-2">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-deep/60 px-1">
            Your Active Harvest Lots ({mine.length})
          </p>
          <div className="flex flex-col gap-3">
            {mine.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
