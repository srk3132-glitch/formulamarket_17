import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { LANGS, useI18n } from "@/lib/i18n";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
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
  TrendingUp,
  Calendar,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

export function DesktopHeader() {
  const { lang, setLang, t } = useI18n();
  const { user, isAuthenticated, logout, switchRole, quickLoginDemo } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signInMenuOpen, setSignInMenuOpen] = useState(false);
  const [tabletMenuOpen, setTabletMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const signInMenuRef = useRef<HTMLDivElement>(null);
  const tabletMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (signInMenuRef.current && !signInMenuRef.current.contains(event.target as Node)) {
        setSignInMenuOpen(false);
      }
      if (tabletMenuRef.current && !tabletMenuRef.current.contains(event.target as Node)) {
        setTabletMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setSignInMenuOpen(false);
        setTabletMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { to: "/rates", label: t("navLive"), icon: TrendingUp },
    { to: "/buy", label: t("navBuy"), icon: ShoppingBag },
    { to: "/sell", label: t("navSell"), icon: Sprout },
    { to: "/slots", label: t("navSlots") || "Slot Booking", icon: Calendar },
    { to: "/how-it-works", label: t("navHow"), icon: HelpCircle },
  ];

  return (
    <header className="relative z-30 mx-auto max-w-6xl px-3 sm:px-5 pt-4 sm:pt-6">
      <nav
        className="flex items-center justify-between gap-2 sm:gap-4 rounded-2xl border border-white/60 bg-white/45 px-3.5 sm:px-5 py-3 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl"
        aria-label="Desktop primary navigation"
      >
        {/* Left: Brand Logo & Tablet Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Tablet Hamburger Toggle Button (visible on md to lg screens) */}
          <button
            type="button"
            onClick={() => setTabletMenuOpen((prev) => !prev)}
            aria-expanded={tabletMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden flex items-center justify-center size-9 rounded-xl border border-brand/20 bg-white/80 text-brand-deep hover:bg-white hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shadow-2xs"
          >
            {tabletMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-inner shrink-0">
              <span className="text-lg leading-none">◖</span>
            </span>
            <span className="block min-w-0">
              <span className="block font-display text-sm sm:text-[15px] font-semibold tracking-tight text-brand-deep truncate">
                {t("brand")}
              </span>
              <span className="-mt-0.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-brand-deep/60 truncate">
                {t("tagline")}
              </span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (>=1024px) */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-5 2xl:gap-6 text-xs xl:text-sm font-semibold text-brand-deep/80 shrink-0">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-ink font-bold border-b-2 border-brand pb-0.5" }}
              className="transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1 py-0.5 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Section: Auth & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 justify-end">
          {/* Authenticated User Menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 whitespace-nowrap ${
                  user.role === "seller"
                    ? "border-emerald-600/30 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100"
                    : "border-amber-600/30 bg-amber-50/80 text-amber-950 hover:bg-amber-100"
                }`}
              >
                <span
                  className={`grid size-5 place-items-center rounded-full text-white shrink-0 ${
                    user.role === "seller" ? "bg-emerald-600" : "bg-amber-600"
                  }`}
                >
                  {user.role === "seller" ? (
                    <Sprout className="size-3" />
                  ) : (
                    <Store className="size-3" />
                  )}
                </span>
                <span className="max-w-[100px] xl:max-w-[130px] truncate">{user.name.split(" ")[0]}</span>
                <span className="text-[10px] font-medium opacity-70 hidden sm:inline">
                  ({user.role === "seller" ? t("farmerBadge") : t("buyerBadge")})
                </span>
                <ChevronDown className="size-3 opacity-60 shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[var(--shadow-glass)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
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
                className="flex items-center gap-1.5 rounded-full border border-brand/50 bg-brand/10 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm backdrop-blur-xl transition hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 whitespace-nowrap"
              >
                <span>{t("signIn")}</span>
                <ChevronDown className="size-3 opacity-70 shrink-0" />
              </button>

              {signInMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[var(--shadow-glass)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
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
                        <div className="grid size-6 place-items-center rounded-lg bg-emerald-600 text-white shrink-0">
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
                        <div className="grid size-6 place-items-center rounded-lg bg-amber-700 text-white shrink-0">
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

          {/* Desktop 26-Language Down-By-Down Dropdown Menu */}
          <LanguageDropdown showQuickPills={true} />
        </div>
      </nav>

      {/* Tablet Navigation Drawer / Dropdown (<1024px) */}
      {tabletMenuOpen && (
        <div
          ref={tabletMenuRef}
          className="absolute left-3 right-3 sm:left-5 sm:right-5 top-full mt-2 z-50 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 lg:hidden"
        >
          <div className="flex items-center justify-between pb-2 border-b border-brand-deep/10 px-2">
            <span className="text-xs font-bold text-brand-deep">Marketplace Navigation</span>
            <span className="text-[10px] font-semibold text-brand bg-brand/10 rounded px-2 py-0.5">
              Formula Market
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setTabletMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-brand-deep transition hover:bg-brand/10 hover:text-brand"
                  activeProps={{ className: "bg-brand/15 text-brand font-bold" }}
                >
                  <Icon className="size-4 text-brand shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
