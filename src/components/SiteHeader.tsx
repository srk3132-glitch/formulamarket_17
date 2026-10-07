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
  Menu,
  X,
  Globe,
  Check,
} from "lucide-react";

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();
  const { user, isAuthenticated, logout, switchRole, quickLoginDemo } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signInMenuOpen, setSignInMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const signInMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (signInMenuRef.current && !signInMenuRef.current.contains(event.target as Node)) {
        setSignInMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangInfo = LANGS.find((l) => l.id === lang) || LANGS[0];

  return (
    <header className="relative z-20 mx-auto max-w-6xl px-5 pt-6">
      <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/45 px-5 py-3.5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-inner">
            <span className="text-lg leading-none">◖</span>
          </span>
          <span className="block">
            <span className="block font-display text-[15px] font-semibold tracking-tight">
              {t("brand")}
            </span>
            <span className="-mt-0.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-brand-deep/60">
              {t("tagline")}
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-7 text-sm font-medium text-brand-deep/80 lg:flex">
          <Link
            to="/rates"
            activeProps={{ className: "text-ink font-bold border-b-2 border-teal-700 pb-0.5" }}
            className="transition hover:text-brand"
          >
            {t("navLive")}
          </Link>
          <Link
            to="/buy"
            activeProps={{ className: "text-ink font-bold border-b-2 border-amber-800 pb-0.5" }}
            className="transition hover:text-brand"
          >
            {t("navBuy")}
          </Link>
          <Link
            to="/sell"
            activeProps={{ className: "text-ink font-bold border-b-2 border-emerald-700 pb-0.5" }}
            className="transition hover:text-brand"
          >
            {t("navSell")}
          </Link>
          <Link
            to="/how-it-works"
            activeProps={{ className: "text-ink font-bold border-b-2 border-brand pb-0.5" }}
            className="transition hover:text-brand"
          >
            {t("navHow")}
          </Link>
        </div>

        {/* Right Section: Auth & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* User Sign In / Profile Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-xl transition ${
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
                <span className="max-w-[120px] truncate sm:max-w-[160px]">
                  {user.name.split(" ")[0]}
                </span>
                <span className="hidden text-[10px] font-medium opacity-70 sm:inline">
                  ({user.role === "seller" ? t("farmerBadge") : t("buyerBadge")})
                </span>
                <ChevronDown className="size-3 opacity-60" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen ? (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[var(--shadow-glass)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-brand-deep/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          user.role === "seller"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {user.role === "seller" ? t("farmerBadge") : t("buyerBadge")}
                      </span>
                    </div>
                    <p className="mt-1 font-display font-semibold text-sm text-brand-deep truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-brand-deep/60 truncate">
                      {user.role === "seller"
                        ? `${user.farmName || "Farmer"} · ${user.placeName || ""}`
                        : `${user.businessName || "Trader"}`}
                    </p>
                    <p className="text-[10px] font-mono text-brand-deep/50 mt-0.5">{user.phone}</p>
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
              ) : null}
            </div>
          ) : (
            /* Unauthenticated: Efficient Sign In Dropdown with 1-Click Instant Login */
            <div className="relative" ref={signInMenuRef}>
              <button
                type="button"
                onClick={() => setSignInMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full border border-brand/50 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm backdrop-blur-xl transition hover:bg-brand hover:text-white"
              >
                <span>{t("signIn")}</span>
                <ChevronDown className="size-3 opacity-70" />
              </button>

              {signInMenuOpen ? (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[var(--shadow-glass)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-1 pb-2 border-b border-brand-deep/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/60">
                      Instant Sign In
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                      1-Click Ready
                    </span>
                  </div>

                  {/* 1-Click Quick Farmer Logins */}
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

                    <button
                      type="button"
                      onClick={() => {
                        quickLoginDemo("seller", 2);
                        setSignInMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl p-2 text-left transition hover:bg-emerald-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid size-6 place-items-center rounded-lg bg-emerald-600 text-white">
                          <Sprout className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-950">Suresh Reddy</p>
                          <p className="text-[10px] text-emerald-700/70">
                            Guntur (AP) · Chilli Farmer
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 rounded px-1.5 py-0.5">
                        Log In
                      </span>
                    </button>
                  </div>

                  {/* 1-Click Quick Buyer Logins */}
                  <div className="mt-2.5 space-y-1 border-t border-brand-deep/10 pt-2">
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

                    <button
                      type="button"
                      onClick={() => {
                        quickLoginDemo("buyer", 1);
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
                            Apex Food Processing
                          </p>
                          <p className="text-[10px] text-amber-800/70">Rajesh Varma · Hyderabad</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 rounded px-1.5 py-0.5">
                        Log In
                      </span>
                    </button>
                  </div>

                  {/* Navigation to Full Sign In Portal */}
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
              ) : null}
            </div>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-expanded={langMenuOpen}
              className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-xs font-semibold text-brand-deep shadow-2xs backdrop-blur-xl transition hover:bg-white hover:border-brand/40"
            >
              <Globe className="size-3.5 text-brand" />
              <span>{currentLangInfo.label}</span>
              <span className="text-[10px] text-brand-deep/50 hidden md:inline">
                ({currentLangInfo.englishLabel})
              </span>
              <ChevronDown
                className={`size-3 text-brand transition-transform ${langMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 border-b border-gray-100 mb-1 flex items-center justify-between">
                  <p className="text-[11px] font-bold text-brand-deep">
                    27 Indian Languages (27 भाषाएँ)
                  </p>
                  <span className="text-[10px] rounded-full bg-brand/10 px-1.5 py-0.5 font-semibold text-brand">
                    Active: {currentLangInfo.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {LANGS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setLang(l.id);
                        setLangMenuOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition ${
                        lang === l.id
                          ? "bg-brand text-white font-semibold shadow-2xs"
                          : "text-brand-deep hover:bg-brand/10 hover:text-brand"
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold">{l.label}</span>
                        <span
                          className={`block text-[10px] truncate ${
                            lang === l.id ? "text-white/80" : "text-brand-deep/50"
                          }`}
                        >
                          {l.englishLabel}
                        </span>
                      </div>
                      {lang === l.id && <Check className="size-3 text-white shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="grid size-8 place-items-center rounded-full border border-white/70 bg-white/55 text-brand-deep lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen ? (
        <div className="mt-2 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-3 font-medium text-sm text-brand-deep">
            <Link
              to="/rates"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-900 transition font-semibold"
            >
              📊 {t("navLive")}
            </Link>
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-brand/10 transition"
            >
              {t("navSell")}
            </Link>
            <Link
              to="/buy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-brand/10 transition"
            >
              {t("navBuy")}
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-brand/10 transition"
            >
              {t("navHow")}
            </Link>

            <div className="border-t border-brand-deep/10 pt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: "/login", search: { role: "seller" } });
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900"
              >
                <Sprout className="size-3.5" />
                <span>{t("farmerBadge")}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: "/login", search: { role: "buyer" } });
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-600/30 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900"
              >
                <Store className="size-3.5" />
                <span>{t("buyerBadge")}</span>
              </button>
            </div>
            <div className="border-t border-brand-deep/10 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-deep/70 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="size-3 text-brand" />
                  भाषा / Language ({LANGS.length})
                </span>
                <span className="text-[10px] font-semibold text-brand">
                  Active: {currentLangInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {LANGS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setLang(l.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                      lang === l.id
                        ? "bg-brand text-white shadow-xs"
                        : "border border-brand-deep/15 bg-white text-brand-deep hover:bg-brand/10"
                    }`}
                  >
                    {l.label} <span className="text-[10px] opacity-70">({l.englishLabel})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
