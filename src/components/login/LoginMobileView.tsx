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
  CheckCircle2,
  ArrowRight,
  LogOut,
  Sparkles,
  PhoneCall,
} from "lucide-react";

export default function LoginMobileView({ redirect }: { redirect?: string }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, isAuthenticated, loginAsSeller, loginAsBuyer, quickLoginDemo, logout, switchRole } =
    useAuth();
  const { region, placeName } = useRegion();

  const [activeTab, setActiveTab] = useState<UserRole>("seller");

  // Phone states
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [businessOrFarm, setBusinessOrFarm] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const cleanPhoneInput = (p: string) => {
    const raw = p.replace(/[^\d+]/g, "");
    if (raw.startsWith("+91")) return raw;
    if (raw.startsWith("91") && raw.length > 10) return `+${raw}`;
    const digitsOnly = p.replace(/\D/g, "");
    if (digitsOnly.length === 10) return `+91 ${digitsOnly}`;
    return p.trim();
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("Please enter your 10-digit mobile number");
      return;
    }
    setIsSending(true);
    setError("");
    setOtpMessage("");
    try {
      const res = await sendTwilioOtp({ data: { phoneNumber: phone } });
      setOtpSent(true);
      if (res.isSimulated && res.simulatedOtp) {
        setOtp(res.simulatedOtp);
        setOtpMessage(`📲 SMS OTP: ${res.simulatedOtp}`);
      } else {
        setOtpMessage(`✅ OTP delivered to ${phone}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send SMS OTP");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("Please enter your 10-digit mobile number");
      return;
    }

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    setIsSending(true);
    try {
      const verifyRes = await verifyTwilioOtp({ data: { phoneNumber: phone, code: otp } });
      if (!verifyRes.success) {
        setError(verifyRes.message || "Invalid OTP entered");
        return;
      }

      const formatted = cleanPhoneInput(phone);
      if (activeTab === "seller") {
        loginAsSeller({
          name: name.trim() || "Kisan Sathi",
          phone: formatted,
          farmName: businessOrFarm.trim() || `${name.trim() || "Kisan"}'s Farm`,
          stateId: region.stateId,
          districtId: region.districtId,
          placeName: placeName,
        });
        navigate({ to: (redirect as "/") || "/sell" });
      } else {
        loginAsBuyer({
          name: name.trim() || "Wholesale Trader",
          phone: formatted,
          email: "buyer@formulamarket.in",
          businessName: businessOrFarm.trim() || "Sri Balaji Traders",
          businessType: "wholesale",
          deliveryCity: placeName,
        });
        navigate({ to: (redirect as "/") || "/buy" });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSending(false);
    }
  };

  // If already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col gap-4 px-3.5 pt-3 pb-8">
        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div
              className={`grid size-12 place-items-center rounded-2xl text-white ${
                user.role === "seller" ? "bg-emerald-600" : "bg-amber-600"
              }`}
            >
              {user.role === "seller" ? <Sprout className="size-6" /> : <Store className="size-6" />}
            </div>
            <div>
              <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                {user.role === "seller" ? t("farmerBadge") : t("buyerBadge")}
              </span>
              <h1 className="font-display text-lg font-bold text-brand-deep">{user.name}</h1>
              <p className="text-xs text-brand-deep/60">{user.phone}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-brand-deep/10">
            <button
              type="button"
              onClick={() => navigate({ to: user.role === "seller" ? "/sell" : "/buy" })}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-sm"
            >
              <span>{user.role === "seller" ? "Go to Sell Harvest" : "Go to Buy Produce"}</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const target = user.role === "seller" ? "buyer" : "seller";
                switchRole(target);
              }}
              className="min-h-[44px] rounded-xl border border-brand-deep/20 bg-white py-2.5 text-xs font-bold text-brand-deep"
            >
              Switch to {user.role === "seller" ? "Buyer Mode" : "Farmer Mode"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="min-h-[44px] rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700"
            >
              {t("signOut")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-3.5 pt-3 pb-8">
      {/* Header */}
      <div className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
          <Sparkles className="size-3 text-amber-500" />
          Universal Fast Sign In
        </span>
        <h1 className="mt-2 font-display text-xl font-bold text-brand-deep">
          {t("portalTitle")}
        </h1>
        <p className="mt-1 text-xs text-brand-deep/70">
          Sign in to list produce, benchmark rates, or reserve direct lots.
        </p>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/80 bg-white/60 p-1 shadow-xs">
        <button
          type="button"
          onClick={() => {
            setActiveTab("seller");
            setError("");
          }}
          className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === "seller"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-brand-deep/70"
          }`}
        >
          <Sprout className="size-3.5" />
          <span>{t("farmerBadge")}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("buyer");
            setError("");
          }}
          className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === "buyer"
              ? "bg-amber-800 text-white shadow-sm"
              : "text-brand-deep/70"
          }`}
        >
          <Store className="size-3.5" />
          <span>{t("buyerBadge")}</span>
        </button>
      </div>

      {/* 1-Click Fast Instant Logins */}
      <div className="rounded-2xl border border-white/80 bg-white/75 p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep/70">
            ⚡ 1-Click Demo Accounts
          </span>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
            Instant
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {activeTab === "seller" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  quickLoginDemo("seller", 0);
                  navigate({ to: (redirect as "/") || "/sell" });
                }}
                className="flex items-center justify-between min-h-[44px] rounded-xl border border-emerald-600/20 bg-emerald-50/70 px-3 py-2 text-left active:scale-98 transition"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-950">Ramesh Patel</p>
                  <p className="text-[10px] text-emerald-700/80">Coimbatore · Farmer</p>
                </div>
                <span className="rounded-lg bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white">
                  Log In
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  quickLoginDemo("seller", 2);
                  navigate({ to: (redirect as "/") || "/sell" });
                }}
                className="flex items-center justify-between min-h-[44px] rounded-xl border border-emerald-600/20 bg-emerald-50/70 px-3 py-2 text-left active:scale-98 transition"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-950">Suresh Reddy</p>
                  <p className="text-[10px] text-emerald-700/80">Guntur (AP) · Chilli Farmer</p>
                </div>
                <span className="rounded-lg bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white">
                  Log In
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  quickLoginDemo("buyer", 0);
                  navigate({ to: (redirect as "/") || "/buy" });
                }}
                className="flex items-center justify-between min-h-[44px] rounded-xl border border-amber-600/20 bg-amber-50/70 px-3 py-2 text-left active:scale-98 transition"
              >
                <div>
                  <p className="text-xs font-bold text-amber-950">Sri Krishna Traders</p>
                  <p className="text-[10px] text-amber-800/80">Venkat Raman · Wholesale</p>
                </div>
                <span className="rounded-lg bg-amber-800 px-2 py-1 text-[10px] font-bold text-white">
                  Log In
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  quickLoginDemo("buyer", 1);
                  navigate({ to: (redirect as "/") || "/buy" });
                }}
                className="flex items-center justify-between min-h-[44px] rounded-xl border border-amber-600/20 bg-amber-50/70 px-3 py-2 text-left active:scale-98 transition"
              >
                <div>
                  <p className="text-xs font-bold text-amber-950">Apex Food Processing</p>
                  <p className="text-[10px] text-amber-800/80">Hyderabad · Food Processor</p>
                </div>
                <span className="rounded-lg bg-amber-800 px-2 py-1 text-[10px] font-bold text-white">
                  Log In
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile OTP Phone Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-xs backdrop-blur-xl space-y-3.5"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-brand-deep/70">
          Or Enter Mobile Number
        </p>

        {error && (
          <p className="rounded-xl border border-rose-300 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">
            {error}
          </p>
        )}

        {otpMessage && (
          <p className="rounded-xl border border-teal-300 bg-teal-50 p-2.5 text-xs font-semibold text-teal-900">
            {otpMessage}
          </p>
        )}

        <label className="block">
          <span className="mb-1 block text-xs font-bold text-brand-deep/70">
            {t("phone")}
          </span>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="+91 98400 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full min-h-[48px] rounded-xl border border-brand-deep/20 bg-white px-3.5 py-3 text-base font-semibold text-brand-deep shadow-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            required
          />
        </label>

        {otpSent && (
          <label className="block animate-in fade-in">
            <span className="mb-1 block text-xs font-bold text-brand-deep/70">
              Enter 6-Digit OTP
            </span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-brand-deep/20 bg-white px-3.5 py-3 text-center text-xl font-mono font-bold tracking-widest text-brand-deep shadow-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>
        )}

        <button
          type="submit"
          disabled={isSending}
          className={`w-full min-h-[48px] rounded-xl py-3 text-sm font-bold text-white shadow-md active:scale-98 transition ${
            activeTab === "seller" ? "bg-emerald-700" : "bg-amber-800"
          }`}
        >
          {isSending ? "Processing..." : otpSent ? "Verify & Sign In" : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
