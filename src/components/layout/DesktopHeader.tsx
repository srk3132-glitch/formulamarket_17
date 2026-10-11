import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { LANGS, useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-store";
import {
  Sprout,
  Store,
  LogOut,
  ChevronDown,
  User,
  ArrowRightLeft,
  PlusCircle,
  ShoppingBag,
} from "lucide-react";

export function DesktopHeader() {
  const { lang, setLang, t } = useI18n();
  const { user, isAuthenticated, logout, switchRole, quickLoginDemo } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signInMenuOpen, setSignInMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const signInMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (signInMenuRef.current && !signInMenuRef.current.contains(event.target as Node)) {
        setSignInMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-30 mx-auto max-w-6xl px-5 pt-6">
      <nav
        className="flex items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/45 px-5 py-3.5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl"
        aria-label="Desktop primary navigation"
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-inner">
            <span className="text-lg leading-none">◖</span>
          </span>
          <span className="block">
            <span className="block font-display text-[15px] font-semibold tracking-tight text-brand-deep">
              {t("brand")}
            </span>
            <span className="-mt-0.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-brand-deep/60">
              {t("tagline")}
            </span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-7 text-sm font-medium text-brand-deep/80">
          <Link
            to="/rates"
            activeProps={{ className: "text-ink font-bold border-b-2 border-teal-700 pb-0.5" }}
            className="transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
          >
            {t("navLive")}
          </Link>
          <Link
            to="/buy"
            activeProps={{ className: "text-ink font-bold border-b-2 border-amber-800 pb-0.5" }}
            className="transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
          >
            {t("navBuy")}
          </Link>
          <Link
            to="/sell"
            activeProps={{ className: "text-ink font-bold border-b-2 border-emerald-700 pb-0.5" }}
            className="transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
          >
            {t("navSell")}
          </Link>
          <Link
            to="/slots"
            activeProps={{ className: "text-ink font-bold border-b-2 border-blue-700 pb-0.5" }}
            className="transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
          >
            {t("navSlots") || "Slot Booking"}
          </Link>
          <Link
            to="/how-it-works"
            activeProps={{ className: "text-ink font-bold border-b-2 border-brand pb-0.5" }}
            className="transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
          >
            {t("navHow")}
          </Link>
        </div>

        {/* Right Section: Auth & Language Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Authenticated User Menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  user.role === "seller"
                    ? "border-emerald-600/30 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100"
                    : "border-amber-600/30 bg-amber-50/80 text-amber-950 hover:bg-amber-100"
                }`}
              >
                <span
                  className={`grid size-5 place-items-center rounded-full text-white ${
                    user.role === "seller" ? "bg-emerald-600" : "bg-amber-600"
                  }`}
                >
                  {user.role === "seller" ? (
                    <Sprout className="size-3" />
                  ) : (
                    <Store className="size-3" />
                  )}
                </span>
                <span className="max-w-[140px] truncate">{user.name.split(" ")[0]}</span>
                <span className="text-[10px] font-medium opacity-70">
                  ({user.role === "seller" ? t("farmerBadge") : t("buyerBadge")})
                </span>
                <ChevronDown className="size-3 opacity-60" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[var(--shadow-glass)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-brand-deep/10 pb-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        user.role === "seller"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {user.role === "seller" ? t("farmerBadge") : t("buyerBadge")}
                    </span>
                    <p className="mt-1 font-display font-semibold text-sm text-brand-deep truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-brand-deep/60 truncate">
                      {user.role === "seller"
                        ? `${user.farmName || "Farmer"} · ${user.placeName || ""}`
                        : `${user.businessName || "Trader"}`}
                    </p>
                  </div>

                  <div className="py-2 space-y-1">
                    {user.role === "seller" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate({ to: "/sell" });
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-brand-deep hover:bg-emerald-50 hover:text-emerald-900 transition text-left"
                      >
                        <PlusCircle className="size-3.5 text-emerald-600" />
                        <span>{t("sellTitle")}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate({ to: "/buy" });
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-brand-deep hover:bg-amber-50 hover:text-amber-900 transition text-left"
                      >
                        <ShoppingBag className="size-3.5 text-amber-700" />
                        <span>{t("buyTitle")}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        const targetRole = user.role === "seller" ? "buyer" : "seller";
                        switchRole(targetRole);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-brand-deep hover:bg-white/80 transition text-left"
                    >
                      <ArrowRightLeft className="size-3.5 text-brand" />
                      <span>Switch to {user.role === "seller" ? "Buyer Mode" : "Farmer Mode"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate({ to: "/login" });
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-brand-deep hover:bg-white/80 transition text-left"
                    >
                      <User className="size-3.5 text-brand-deep/60" />
                      <span>Account Details</span>
                    </button>
                  </div>

                  <div className="border-t border-brand-deep/10 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 transition text-left"
                    >
                      <LogOut className="size-3.5" />
                      <span>{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Dropdown */
            <div className="relative" ref={signInMenuRef}>
              <button
                type="button"
                onClick={() => setSignInMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full border border-brand/50 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm backdrop-blur-xl transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span>{t("signIn")}</span>
                <ChevronDown className="size-3 opacity-70" />
              </button>

              {signInMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[var(--shadow-glass)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-1 pb-2 border-b border-brand-deep/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/60">
                      Instant Sign In
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                      1-Click Ready
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="px-1 text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Farmer Accounts
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        quickLoginDemo("seller", 0);
                        setSignInMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl p-2 text-left transition hover:bg-emerald-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid size-6 place-items-center rounded-lg bg-emerald-600 text-white">
                          <Sprout className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-950">Ramesh Patel</p>
                          <p className="text-[10px] text-emerald-700/70">Coimbatore · Farmer</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 rounded px-1.5 py-0.5">
                        Log In
                      </span>
                    </button>
                  </div>

                  <div className="mt-2 space-y-1 border-t border-brand-deep/10 pt-2">
                    <p className="px-1 text-[10px] font-semibold text-amber-900 uppercase tracking-wider">
                      Buyer & Trader Accounts
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        quickLoginDemo("buyer", 0);
                        setSignInMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl p-2 text-left transition hover:bg-amber-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid size-6 place-items-center rounded-lg bg-amber-700 text-white">
                          <Store className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-amber-950">
                            Sri Krishna Traders
                          </p>
                          <p className="text-[10px] text-amber-800/70">Venkat Raman · Wholesale</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 rounded px-1.5 py-0.5">
                        Log In
                      </span>
                    </button>
                  </div>

                  <div className="mt-2.5 border-t border-brand-deep/10 pt-2 grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSignInMenuOpen(false);
                        navigate({ to: "/login", search: { role: "seller" } });
                      }}
                      className="rounded-lg border border-emerald-600/30 bg-emerald-50/60 py-1.5 text-center text-[11px] font-semibold text-emerald-900 transition hover:bg-emerald-100"
                    >
                      Farmer Portal →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInMenuOpen(false);
                        navigate({ to: "/login", search: { role: "buyer" } });
                      }}
                      className="rounded-lg border border-amber-600/30 bg-amber-50/60 py-1.5 text-center text-[11px] font-semibold text-amber-900 transition hover:bg-amber-100"
                    >
                      Buyer Portal →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop Language Selector */}
          <div className="flex items-center gap-1 rounded-full border border-white/70 bg-white/55 p-0.5 backdrop-blur-xl">
            {LANGS.slice(0, 6).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                className={
                  lang === l.id
                    ? "rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm"
                    : "rounded-full px-2 py-1 text-[11px] font-semibold text-brand-deep/70 transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
                }
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
