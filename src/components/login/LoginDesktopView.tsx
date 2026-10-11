import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useAuth,
  DEMO_SELLERS,
  DEMO_BUYERS,
  type UserRole,
  type BuyerCategory,
} from "@/lib/auth-store";
import { useI18n } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";
import { sendTwilioOtp, verifyTwilioOtp } from "@/lib/twilio-service";
import {
  Sprout,
  Store,
  ShieldCheck,
  TrendingUp,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Building2,
  Sparkles,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-white/80 bg-white/70 px-3.5 py-2.5 text-sm font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-brand/60 focus:bg-white transition";

export default function LoginDesktopView({
  initialRole,
  redirect,
}: {
  initialRole?: UserRole;
  redirect?: string;
}) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, isAuthenticated, loginAsSeller, loginAsBuyer, quickLoginDemo, logout, switchRole } =
    useAuth();
  const { region, placeName } = useRegion();

  const [activeTab, setActiveTab] = useState<UserRole>(initialRole ?? "seller");

  useEffect(() => {
    if (initialRole) {
      setActiveTab(initialRole);
    }
  }, [initialRole]);

  // Seller Form State
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerFarmName, setSellerFarmName] = useState("");
  const [sellerOtpSent, setSellerOtpSent] = useState(false);
  const [sellerOtp, setSellerOtp] = useState("");
  const [sellerMode, setSellerMode] = useState<"signin" | "register">("signin");
  const [sellerError, setSellerError] = useState("");
  const [sellerIsSending, setSellerIsSending] = useState(false);
  const [sellerOtpMessage, setSellerOtpMessage] = useState("");

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
  const [buyerIsSending, setBuyerIsSending] = useState(false);
  const [buyerOtpMessage, setBuyerOtpMessage] = useState("");

  const cleanPhoneInput = (p: string) => {
    const raw = p.replace(/[^\d+]/g, "");
    if (raw.startsWith("+91")) return raw;
    if (raw.startsWith("91") && raw.length > 10) return `+${raw}`;
    const digitsOnly = p.replace(/\D/g, "");
    if (digitsOnly.length === 10) return `+91 ${digitsOnly}`;
    return p.trim();
  };

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
    navigate({ to: (redirect as "/") || "/sell" });
  };

  const handleSendSellerOtp = async () => {
    if (!sellerPhone.trim()) {
      setSellerError("Please enter a valid 10-digit mobile number");
      return;
    }
    setSellerIsSending(true);
    setSellerError("");
    setSellerOtpMessage("");
    try {
      const res = await sendTwilioOtp({ data: { phoneNumber: sellerPhone } });
      setSellerOtpSent(true);
      if (res.isSimulated && res.simulatedOtp) {
        setSellerOtp(res.simulatedOtp);
        setSellerOtpMessage(`📲 [Twilio Simulator] SMS code sent: ${res.simulatedOtp}`);
      } else {
        setSellerOtpMessage(`✅ Real-time OTP delivered via Twilio SMS to ${sellerPhone}`);
      }
    } catch (err: unknown) {
      setSellerError(err instanceof Error ? err.message : "Failed to send SMS OTP");
    } finally {
      setSellerIsSending(false);
    }
  };

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSellerError("");

    if (!sellerPhone.trim()) {
      setSellerError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!sellerOtpSent) {
      await handleSendSellerOtp();
      return;
    }

    setSellerIsSending(true);
    try {
      const verifyRes = await verifyTwilioOtp({ data: { phoneNumber: sellerPhone, code: sellerOtp } });
      if (!verifyRes.success) {
        setSellerError(verifyRes.message || "Invalid OTP entered");
        return;
      }
      handleFastSellerSignIn();
    } catch (err: unknown) {
      setSellerError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setSellerIsSending(false);
    }
  };

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
    navigate({ to: (redirect as "/") || "/buy" });
  };

  const handleSendBuyerOtp = async () => {
    if (!buyerPhone.trim()) {
      setBuyerError("Please enter your mobile number");
      return;
    }
    setBuyerIsSending(true);
    setBuyerError("");
    setBuyerOtpMessage("");
    try {
      const res = await sendTwilioOtp({ data: { phoneNumber: buyerPhone } });
      setBuyerOtpSent(true);
      if (res.isSimulated && res.simulatedOtp) {
        setBuyerOtp(res.simulatedOtp);
        setBuyerOtpMessage(`📲 [Twilio Simulator] SMS code sent: ${res.simulatedOtp}`);
      } else {
        setBuyerOtpMessage(`✅ Real-time OTP delivered via Twilio SMS to ${buyerPhone}`);
      }
    } catch (err: unknown) {
      setBuyerError(err instanceof Error ? err.message : "Failed to send SMS OTP");
    } finally {
      setBuyerIsSending(false);
    }
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyerError("");

    if (!buyerPhone.trim() && !buyerEmail.trim()) {
      setBuyerError("Please enter your mobile number or business email");
      return;
    }

    if (!buyerOtpSent) {
      await handleSendBuyerOtp();
      return;
    }

    setBuyerIsSending(true);
    try {
      const verifyRes = await verifyTwilioOtp({ data: { phoneNumber: buyerPhone, code: buyerOtp } });
      if (!verifyRes.success) {
        setBuyerError(verifyRes.message || "Invalid OTP entered");
        return;
      }
      handleFastBuyerSignIn();
    } catch (err: unknown) {
      setBuyerError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBuyerIsSending(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <main className="relative z-10 mx-auto max-w-4xl px-5 pb-20 pt-10 animate-fade-in">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/50 p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-deep/10 pb-6">
            <div className="flex items-center gap-3.5">
              <div
                className={`grid size-14 place-items-center rounded-2xl shadow-inner ${
                  user.role === "seller" ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                }`}
              >
                {user.role === "seller" ? <Sprout className="size-7" /> : <Store className="size-7" />}
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

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: user.role === "seller" ? "/sell" : "/buy" })}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90"
            >
              <span>{user.role === "seller" ? "Go to Sell Produce" : "Go to Buy Harvests"}</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const target = user.role === "seller" ? "buyer" : "seller";
                switchRole(target);
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
    <main className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-8 animate-fade-in">
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
              : "text-brand-deep/70 hover:bg-white/50"
          }`}
        >
          <Sprout className="size-4 text-emerald-600" />
          <span>{t("farmerSignIn")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("buyer")}
          className={`flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold transition-all ${
            activeTab === "buyer"
              ? "bg-white text-amber-900 shadow-md ring-1 ring-amber-600/20"
              : "text-brand-deep/70 hover:bg-white/50"
          }`}
        >
          <Store className="size-4 text-amber-700" />
          <span>{t("buyerSignIn")}</span>
        </button>
      </div>

      {/* Main 2-Column Desktop Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-white/70 bg-white/50 p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
          {activeTab === "seller" ? (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-emerald-950">
                {t("farmerSignIn")}
              </h2>
              <p className="mt-1 text-xs text-brand-deep/70">{t("farmerDesc")}</p>

              {sellerError && (
                <p className="mt-3 rounded-xl border border-rose-300 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">
                  {sellerError}
                </p>
              )}

              {sellerOtpMessage && (
                <p className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-900">
                  {sellerOtpMessage}
                </p>
              )}

              <form onSubmit={handleSellerSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-brand-deep/70">
                    {t("phone")}
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98400 00000"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className={inputClass}
                    required
                  />
                </label>

                {sellerOtpSent && (
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-brand-deep/70">
                      Enter 6-Digit OTP
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={sellerOtp}
                      onChange={(e) => setSellerOtp(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </label>
                )}

                <button
                  type="submit"
                  disabled={sellerIsSending}
                  className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
                >
                  {sellerIsSending ? "Processing..." : sellerOtpSent ? "Verify & Sign In" : "Send OTP"}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-amber-950">
                {t("buyerSignIn")}
              </h2>
              <p className="mt-1 text-xs text-brand-deep/70">{t("buyerDesc")}</p>

              {buyerError && (
                <p className="mt-3 rounded-xl border border-rose-300 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">
                  {buyerError}
                </p>
              )}

              {buyerOtpMessage && (
                <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs font-semibold text-amber-900">
                  {buyerOtpMessage}
                </p>
              )}

              <form onSubmit={handleBuyerSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-brand-deep/70">
                    {t("phone")}
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98401 00000"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className={inputClass}
                    required
                  />
                </label>

                {buyerOtpSent && (
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-brand-deep/70">
                      Enter 6-Digit OTP
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={buyerOtp}
                      onChange={(e) => setBuyerOtp(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </label>
                )}

                <button
                  type="submit"
                  disabled={buyerIsSending}
                  className="w-full rounded-xl bg-amber-800 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-900 transition"
                >
                  {buyerIsSending ? "Processing..." : buyerOtpSent ? "Verify & Sign In" : "Send OTP"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Demo Accounts & Feature Highlights */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/70 bg-white/50 p-6 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-deep/10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-deep/70">
                1-Click Instant Demo Logins
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                Ready
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-[11px] font-semibold text-emerald-900">Farmers</p>
              {DEMO_SELLERS.slice(0, 2).map((s, idx) => (
                <button
                  key={s.phone}
                  type="button"
                  onClick={() => {
                    quickLoginDemo("seller", idx);
                    navigate({ to: (redirect as "/") || "/sell" });
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-emerald-600/20 bg-emerald-50/70 p-2.5 text-left hover:bg-emerald-100 transition"
                >
                  <div>
                    <p className="text-xs font-bold text-emerald-950">{s.name}</p>
                    <p className="text-[10px] text-emerald-700">{s.placeName} · {s.farmName}</p>
                  </div>
                  <span className="rounded bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white">
                    Sign In
                  </span>
                </button>
              ))}

              <p className="text-[11px] font-semibold text-amber-900 pt-2">Buyers</p>
              {DEMO_BUYERS.slice(0, 2).map((b, idx) => (
                <button
                  key={b.phone}
                  type="button"
                  onClick={() => {
                    quickLoginDemo("buyer", idx);
                    navigate({ to: (redirect as "/") || "/buy" });
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-amber-600/20 bg-amber-50/70 p-2.5 text-left hover:bg-amber-100 transition"
                >
                  <div>
                    <p className="text-xs font-bold text-amber-950">{b.businessName}</p>
                    <p className="text-[10px] text-amber-800">{b.name} · {b.deliveryCity}</p>
                  </div>
                  <span className="rounded bg-amber-800 px-2 py-1 text-[10px] font-bold text-white">
                    Sign In
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
