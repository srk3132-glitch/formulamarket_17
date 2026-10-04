import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useAuth,
  DEMO_SELLERS,
  DEMO_BUYERS,
  type UserRole,
  type BuyerCategory,
} from "@/lib/auth-store";
import { useI18n, CROPS, cropName } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { RegionSelector } from "@/components/RegionSelector";
import {
  Sprout,
  Store,
  ShieldCheck,
  TrendingUp,
  PhoneCall,
  Truck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  UserCheck,
  Building2,
  Lock,
  Sparkles,
} from "lucide-react";

interface LoginSearchParams {
  role?: "seller" | "buyer" | undefined;
  redirect?: string | undefined;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
    const roleVal = search["role"];
    const redirectVal = search["redirect"];
    return {
      role: roleVal === "buyer" || roleVal === "seller" ? roleVal : undefined,
      redirect: typeof redirectVal === "string" ? redirectVal : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In — Formula Market Agricultural Portal" },
      {
        name: "description",
        content:
          "Separate sign in portals for Farmers / Sellers to list harvests and Buyers / Traders to procure produce directly with live mandi benchmark rates.",
      },
    ],
  }),
  component: LoginPage,
});

const inputClass =
  "w-full rounded-xl border border-white/80 bg-white/70 px-3.5 py-2.5 text-sm font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-brand/60 focus:bg-white transition";

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user, isAuthenticated, loginAsSeller, loginAsBuyer, quickLoginDemo, logout, switchRole } =
    useAuth();
  const { region, placeName } = useRegion();

  const [activeTab, setActiveTab] = useState<UserRole>(search.role ?? "seller");

  // Sync tab with URL search if changed
  useEffect(() => {
    if (search.role) {
      setActiveTab(search.role);
    }
  }, [search.role]);

  // Seller Form State
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerFarmName, setSellerFarmName] = useState("");
  const [sellerOtpSent, setSellerOtpSent] = useState(false);
  const [sellerOtp, setSellerOtp] = useState("");
  const [sellerMode, setSellerMode] = useState<"signin" | "register">("signin");
  const [sellerError, setSellerError] = useState("");

  // Buyer Form State
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerBusinessName, setBuyerBusinessName] = useState("");
  const [buyerCategory, setBuyerCategory] = useState<BuyerCategory>("wholesale");
  const [buyerCity, setBuyerCity] = useState("");
  const [buyerOtpSent, setBuyerOtpSent] = useState(false);
  const [buyerOtp, setBuyerOtp] = useState("");
  const [buyerMode, setBuyerMode] = useState<"signin" | "register">("signin");
  const [buyerError, setBuyerError] = useState("");

  // Fast phone formatting helper
  const cleanPhoneInput = (p: string) => {
    const raw = p.replace(/[^\d+]/g, "");
    if (raw.startsWith("+91")) return raw;
    if (raw.startsWith("91") && raw.length > 10) return `+${raw}`;
    const digitsOnly = p.replace(/\D/g, "");
    if (digitsOnly.length === 10) return `+91 ${digitsOnly}`;
    return p.trim();
  };

  // Instant 1-Click Seller Login (bypasses redundant OTP steps)
  const handleFastSellerSignIn = (phoneNum?: string) => {
    const targetPhone = phoneNum || sellerPhone;
    if (!targetPhone.trim()) {
      setSellerError("Please enter your mobile number");
      return;
    }
    const formatted = cleanPhoneInput(targetPhone);
    loginAsSeller({
      name: sellerName.trim() || "Kisan Sathi",
      phone: formatted,
      farmName: sellerFarmName.trim() || `${sellerName.trim() || "Kisan"}'s Farm`,
      stateId: region.stateId,
      districtId: region.districtId,
      placeName: placeName,
    });
    if (search.redirect) {
      navigate({ to: search.redirect as "/" });
    } else {
      navigate({ to: "/sell" });
    }
  };

  // Standard Handler for Seller Submit
  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSellerError("");

    if (!sellerPhone.trim()) {
      setSellerError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!sellerOtpSent) {
      // Simulate sending OTP & auto-fill demo OTP
      setSellerOtpSent(true);
      setSellerOtp("1234");
      return;
    }

    // Verify OTP
    if (sellerOtp !== "1234" && sellerOtp.length < 4) {
      setSellerError("Invalid OTP. Try demo OTP: 1234");
      return;
    }

    handleFastSellerSignIn();
  };

  // Instant 1-Click Buyer Login
  const handleFastBuyerSignIn = (phoneNum?: string) => {
    const targetPhone = phoneNum || buyerPhone;
    if (!targetPhone.trim() && !buyerEmail.trim()) {
      setBuyerError("Please enter your mobile number or business email");
      return;
    }
    const formatted = targetPhone ? cleanPhoneInput(targetPhone) : "+91 98401 00000";
    loginAsBuyer({
      name: buyerName.trim() || "Wholesale Trader",
      phone: formatted,
      email: buyerEmail.trim() || "buyer@formulamarket.in",
      businessName: buyerBusinessName.trim() || "Sri Balaji Mandi Traders",
      businessType: buyerCategory,
      deliveryCity: buyerCity.trim() || "Regional Hub",
    });
    if (search.redirect) {
      navigate({ to: search.redirect as "/" });
    } else {
      navigate({ to: "/buy" });
    }
  };

  // Standard Handler for Buyer Submit
  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBuyerError("");

    if (!buyerPhone.trim() && !buyerEmail.trim()) {
      setBuyerError("Please enter your mobile number or business email");
      return;
    }

    if (!buyerOtpSent) {
      setBuyerOtpSent(true);
      setBuyerOtp("1234");
      return;
    }

    if (buyerOtp !== "1234" && buyerOtp.length < 4) {
      setBuyerError("Invalid OTP. Try demo OTP: 1234");
      return;
    }

    handleFastBuyerSignIn();
  };

  // If already authenticated, show user status card with options
  if (isAuthenticated && user) {
    return (
      <main className="relative z-10 mx-auto max-w-4xl px-5 pb-20 pt-10">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/50 p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-deep/10 pb-6">
            <div className="flex items-center gap-3.5">
              <div
                className={`grid size-14 place-items-center rounded-2xl shadow-inner ${
                  user.role === "seller" ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                }`}
              >
                {user.role === "seller" ? (
                  <Sprout className="size-7" />
                ) : (
                  <Store className="size-7" />
                )}
              </div>
              <div>
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    user.role === "seller"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {user.role === "seller" ? t("farmerBadge") : t("buyerBadge")}
                </span>
                <h1 className="font-display text-2xl font-bold tracking-tight text-brand-deep">
                  {user.name}
                </h1>
                <p className="text-xs text-brand-deep/60">
                  {user.role === "seller"
                    ? `${user.farmName || "Farm"} · ${user.placeName || placeName}`
                    : `${user.businessName || "Business"} · ${user.deliveryCity || "Mandi Hub"}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-deep/20 bg-white/70 px-4 py-2 text-xs font-semibold text-brand-deep transition hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4" />
              {t("signOut")}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-deep/60">
                Contact Details
              </p>
              <p className="mt-1 font-medium text-brand-deep">{user.phone}</p>
              {user.email ? <p className="text-xs text-brand-deep/70">{user.email}</p> : null}
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-deep/60">
                {user.role === "seller" ? "Registered Mandi Location" : "Business Profile"}
              </p>
              <p className="mt-1 font-medium text-brand-deep">
                {user.role === "seller"
                  ? `${user.placeName || placeName} Market`
                  : `${user.businessType ? user.businessType.toUpperCase() : "COMMERCIAL"} TRADER`}
              </p>
              <p className="text-xs text-brand-deep/70">
                {user.role === "seller"
                  ? "Verified Producer ID: KB-FARM-90"
                  : `License: ${user.licenseNo || "Verified"}`}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-brand-deep/10 pt-6">
            {user.role === "seller" ? (
              <button
                type="button"
                onClick={() => navigate({ to: "/sell" })}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90"
              >
                Go to Sell Produce <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate({ to: "/buy" })}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90"
              >
                Go to Buy Harvests <ArrowRight className="size-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const targetRole = user.role === "seller" ? "buyer" : "seller";
                switchRole(targetRole);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-brand-deep transition hover:bg-white"
            >
              Switch to {user.role === "seller" ? "Buyer / Trader Mode" : "Farmer Mode"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-8">
      {/* Title Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3.5 py-1 text-xs font-semibold text-brand-deep shadow-sm backdrop-blur-xl">
          <Sparkles className="size-3.5 text-amber-500" />
          Formula Market Universal Access
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-deep sm:text-4xl">
          {t("portalTitle")}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-brand-deep/70">
          {t("portalSub")}
        </p>
      </div>

      {/* Role Selection Switcher Tabs */}
      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 rounded-2xl border border-white/80 bg-white/40 p-1.5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("seller")}
          className={`flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold transition-all ${
            activeTab === "seller"
              ? "bg-white text-emerald-800 shadow-md ring-1 ring-emerald-600/20"
              : "text-brand-deep/70 hover:bg-white/50 hover:text-brand-deep"
          }`}
        >
          <div
            className={`grid size-7 place-items-center rounded-lg ${
              activeTab === "seller"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <Sprout className="size-4" />
          </div>
          <span>{t("farmerSignIn")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("buyer")}
          className={`flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold transition-all ${
            activeTab === "buyer"
              ? "bg-white text-amber-900 shadow-md ring-1 ring-amber-600/20"
              : "text-brand-deep/70 hover:bg-white/50 hover:text-brand-deep"
          }`}
        >
          <div
            className={`grid size-7 place-items-center rounded-lg ${
              activeTab === "buyer" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800"
            }`}
          >
            <Store className="size-4" />
          </div>
          <span>{t("buyerSignIn")}</span>
        </button>
      </div>

      {/* Main Form & Benefits Container */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Left Column: Role-Specific Sign In Card */}
        <div className="rounded-3xl border border-white/70 bg-white/50 p-6 sm:p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
          {activeTab === "seller" ? (
            /* FARMER / SELLER SIGN IN FORM */
            <div>
              <div className="flex items-center justify-between border-b border-brand-deep/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-emerald-950">
                    {sellerMode === "signin" ? t("farmerSignIn") : "Register New Farmer"}
                  </h2>
                  <p className="mt-1 text-xs text-brand-deep/70">{t("farmerDesc")}</p>
                </div>
                <span className="rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  {t("farmerBadge")}
                </span>
              </div>

              {sellerError ? (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {sellerError}
                </p>
              ) : null}

              <form onSubmit={handleSellerSubmit} className="mt-5 space-y-4">
                {sellerMode === "register" ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                        {t("yourName")} / Farmer Name
                      </span>
                      <input
                        type="text"
                        required
                        className={inputClass}
                        placeholder="e.g. Ramesh Patel"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                        {t("kisanId")}
                      </span>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Patel Krishi Farm / Kisan No."
                        value={sellerFarmName}
                        onChange={(e) => setSellerFarmName(e.target.value)}
                      />
                    </label>
                  </>
                ) : null}

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                    {t("mobileNumber")}
                  </span>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-semibold text-brand-deep/60">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      placeholder="98400 00000"
                      className={`${inputClass} pl-12`}
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                    />
                  </div>
                </label>

                {sellerOtpSent ? (
                  <label className="block">
                    <div className="mb-1 flex items-center justify-between text-xs font-medium text-brand-deep/70">
                      <span>{t("enterOtp")}</span>
                      <span className="font-semibold text-emerald-700">Demo OTP: 1234</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        className={`${inputClass} font-mono tracking-widest text-base`}
                        placeholder="1234"
                        value={sellerOtp}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSellerOtp(val);
                          if (val === "1234" || val.length === 4) {
                            handleFastSellerSignIn();
                          }
                        }}
                      />
                      <Lock className="absolute right-3.5 top-3 size-4 text-brand-deep/40" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-[11px] text-emerald-800">{t("otpSentSuccess")}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSellerOtp("1234");
                          handleFastSellerSignIn();
                        }}
                        className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-lg transition"
                      >
                        ⚡ 1-Click Auto-Fill & Enter
                      </button>
                    </div>
                  </label>
                ) : null}

                <div className="rounded-2xl border border-white/70 bg-white/60 p-3.5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-deep/60">
                    {t("whereSelling")} ({placeName} Mandi)
                  </p>
                  <RegionSelector />
                </div>

                {/* Primary & Secondary Sign In Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFastSellerSignIn()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800 active:scale-[0.99]"
                  >
                    <span>⚡ Instant 1-Click Sign In</span>
                    <ArrowRight className="size-4" />
                  </button>

                  {!sellerOtpSent ? (
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-emerald-600/30 bg-white/70 py-2.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50"
                    >
                      {t("sendOtp")} (SMS Verification)
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-emerald-600/30 bg-white/70 py-2.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50"
                    >
                      {t("verifyOtp")}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSellerMode(sellerMode === "signin" ? "register" : "signin");
                      setSellerOtpSent(false);
                      setSellerError("");
                    }}
                    className="font-medium text-emerald-800 hover:underline"
                  >
                    {sellerMode === "signin"
                      ? "New farmer? Register harvest profile →"
                      : "Already registered? Quick sign in →"}
                  </button>
                  {sellerOtpSent ? (
                    <button
                      type="button"
                      onClick={() => setSellerOtpSent(false)}
                      className="text-brand-deep/60 hover:text-brand-deep"
                    >
                      Resend OTP
                    </button>
                  ) : null}
                </div>
              </form>

              {/* Instant 1-Click Demo Logins for Farmers from all 4 states */}
              <div className="mt-6 border-t border-brand-deep/10 pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-900/80">
                    ⚡ Fast 1-Click Farmer Profiles (All 4 States)
                  </p>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100/80 rounded px-1.5 py-0.5 font-medium">
                    TN · AP · TS · KL
                  </span>
                </div>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {DEMO_SELLERS.map((farmer, idx) => (
                    <button
                      key={farmer.id}
                      type="button"
                      onClick={() => {
                        quickLoginDemo("seller", idx);
                        if (search.redirect) {
                          navigate({ to: search.redirect as "/" });
                        } else {
                          navigate({ to: "/sell" });
                        }
                      }}
                      className="flex flex-col items-start rounded-xl border border-emerald-600/20 bg-emerald-50/70 p-2.5 text-left transition hover:border-emerald-600/50 hover:bg-emerald-100/80 group"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-xs text-emerald-950 group-hover:text-emerald-900">
                          {farmer.name}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-white/80 text-emerald-800 rounded px-1">
                          {farmer.stateId}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800/80 truncate w-full">
                        {farmer.placeName}
                      </span>
                      <span className="mt-1 text-[10px] font-medium text-emerald-700">
                        {farmer.primaryCrops
                          ?.map((c) => cropName(c, lang))
                          .slice(0, 2)
                          .join(", ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* BUYER / TRADER SIGN IN FORM */
            <div>
              <div className="flex items-center justify-between border-b border-brand-deep/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-amber-950">
                    {buyerMode === "signin" ? t("buyerSignIn") : "Register Buyer Account"}
                  </h2>
                  <p className="mt-1 text-xs text-brand-deep/70">{t("buyerDesc")}</p>
                </div>
                <span className="rounded-xl bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                  {t("buyerBadge")}
                </span>
              </div>

              {buyerError ? (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {buyerError}
                </p>
              ) : null}

              <form onSubmit={handleBuyerSubmit} className="mt-5 space-y-4">
                {buyerMode === "register" ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                        {t("businessName")}
                      </span>
                      <input
                        type="text"
                        required
                        className={inputClass}
                        placeholder="e.g. Sri Krishna Wholesale Traders"
                        value={buyerBusinessName}
                        onChange={(e) => setBuyerBusinessName(e.target.value)}
                      />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                          Contact Person Name
                        </span>
                        <input
                          type="text"
                          required
                          className={inputClass}
                          placeholder="e.g. Venkat Raman"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                          {t("buyerCategory")}
                        </span>
                        <select
                          className={inputClass}
                          value={buyerCategory}
                          onChange={(e) => setBuyerCategory(e.target.value as BuyerCategory)}
                        >
                          <option value="wholesale">{t("wholesaleTrader")}</option>
                          <option value="retail">{t("retailStore")}</option>
                          <option value="processor">{t("foodProcessor")}</option>
                          <option value="consumer">{t("directConsumer")}</option>
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                        {t("deliveryLocation")}
                      </span>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Chennai, Koyambedu Hub"
                        value={buyerCity}
                        onChange={(e) => setBuyerCity(e.target.value)}
                      />
                    </label>
                  </>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                      {t("mobileNumber")}
                    </span>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-semibold text-brand-deep/60">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        placeholder="98401 00000"
                        className={`${inputClass} pl-12`}
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-brand-deep/70">
                      Business Email (Optional)
                    </span>
                    <input
                      type="email"
                      placeholder="trade@company.com"
                      className={inputClass}
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                    />
                  </label>
                </div>

                {buyerOtpSent ? (
                  <label className="block">
                    <div className="mb-1 flex items-center justify-between text-xs font-medium text-brand-deep/70">
                      <span>{t("enterOtp")}</span>
                      <span className="font-semibold text-amber-800">Demo OTP: 1234</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        className={`${inputClass} font-mono tracking-widest text-base`}
                        placeholder="1234"
                        value={buyerOtp}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBuyerOtp(val);
                          if (val === "1234" || val.length === 4) {
                            handleFastBuyerSignIn();
                          }
                        }}
                      />
                      <Lock className="absolute right-3.5 top-3 size-4 text-brand-deep/40" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="mt-1 text-[11px] text-amber-900">{t("otpSentSuccess")}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setBuyerOtp("1234");
                          handleFastBuyerSignIn();
                        }}
                        className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition"
                      >
                        ⚡ 1-Click Auto-Fill & Enter
                      </button>
                    </div>
                  </label>
                ) : null}

                {/* Primary & Secondary Sign In Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFastBuyerSignIn()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-800 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-900 active:scale-[0.99]"
                  >
                    <span>⚡ Instant 1-Click Sign In</span>
                    <ArrowRight className="size-4" />
                  </button>

                  {!buyerOtpSent ? (
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-amber-600/30 bg-white/70 py-2.5 text-xs font-semibold text-amber-950 transition hover:bg-amber-50"
                    >
                      {t("sendOtp")} (SMS Verification)
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-amber-600/30 bg-white/70 py-2.5 text-xs font-semibold text-amber-950 transition hover:bg-amber-50"
                    >
                      {t("verifyOtp")}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setBuyerMode(buyerMode === "signin" ? "register" : "signin");
                      setBuyerOtpSent(false);
                      setBuyerError("");
                    }}
                    className="font-medium text-amber-900 hover:underline"
                  >
                    {buyerMode === "signin"
                      ? "New commercial buyer? Register company →"
                      : "Already registered? Quick sign in →"}
                  </button>
                  {buyerOtpSent ? (
                    <button
                      type="button"
                      onClick={() => setBuyerOtpSent(false)}
                      className="text-brand-deep/60 hover:text-brand-deep"
                    >
                      Resend OTP
                    </button>
                  ) : null}
                </div>
              </form>

              {/* Instant 1-Click Demo Logins for Buyers */}
              <div className="mt-6 border-t border-brand-deep/10 pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-950/80">
                    ⚡ Fast 1-Click Buyer Profiles (Wholesale & Retail)
                  </p>
                  <span className="text-[10px] text-amber-900 bg-amber-100/80 rounded px-1.5 py-0.5 font-medium">
                    Verified APMC
                  </span>
                </div>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {DEMO_BUYERS.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        quickLoginDemo("buyer", idx);
                        if (search.redirect) {
                          navigate({ to: search.redirect as "/" });
                        } else {
                          navigate({ to: "/buy" });
                        }
                      }}
                      className="flex flex-col items-start rounded-xl border border-amber-600/20 bg-amber-50/70 p-2.5 text-left transition hover:border-amber-600/50 hover:bg-amber-100/80 group"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-xs text-amber-950 group-hover:text-amber-900">
                          {b.businessName}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-white/80 text-amber-900 rounded px-1">
                          {b.businessType}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-800/80">
                        {b.name} · {b.deliveryCity}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Portal Feature Comparison & Highlights */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/60 bg-white/40 p-6 sm:p-8 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                activeTab === "seller"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              {activeTab === "seller" ? "Producer Network" : "Commercial Procurement"}
            </span>

            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-brand-deep">
              {activeTab === "seller"
                ? "Why Farmers Love Formula Market"
                : "Direct Wholesale Advantage"}
            </h3>

            <div className="mt-5 space-y-4">
              {activeTab === "seller" ? (
                <>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/60 p-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                      <TrendingUp className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-deep">
                        0% Middleman Commission
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-brand-deep/70">
                        Receive 100% of agreed prices. No broker deduction or hidden mandi fees.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/60 p-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-deep">
                        Live Mandi Price Benchmark
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-brand-deep/70">
                        Know the exact APMC min, max and modal price before deciding your harvest
                        price.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/60 p-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                      <PhoneCall className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-deep">
                        Direct Buyer Phone Calls
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-brand-deep/70">
                        Verified traders contact your mobile or WhatsApp directly for pickup.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/60 p-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-700 text-white">
                      <Truck className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-deep">
                        Direct Farm-Gate Sourcing
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-brand-deep/70">
                        Procure fresh harvests straight from fields across Tamil Nadu, AP, Telangana
                        & Kerala.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/60 p-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-700 text-white">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-deep">
                        Instant Lot Reservation
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-brand-deep/70">
                        Lock in harvest lots with transparent quantity and price before mandi
                        arrival.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/60 p-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-700 text-white">
                      <Building2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-deep">
                        Bulk Invoicing & GST Compliance
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-brand-deep/70">
                        Streamlined documentation for wholesale food businesses and millers.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-brand/20 bg-brand/10 p-4 text-center">
            <p className="text-xs font-semibold text-brand-deep">
              Need help selecting your account?
            </p>
            <p className="mt-0.5 text-[11px] text-brand-deep/70">
              Farmers list produce on the Seller tab. Merchants & millers sign in on the Buyer tab.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
