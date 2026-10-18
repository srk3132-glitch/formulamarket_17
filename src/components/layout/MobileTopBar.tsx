import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useI18n, LANGS } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-store";
import { LanguageModal } from "@/components/common/LanguageModal";
import { HorizontalLanguageSelector } from "@/components/common/HorizontalLanguageSelector";
import {
  Globe,
  User,
  Sprout,
  Store,
  Menu,
  X,
  TrendingUp,
  ShoppingBag,
  Calendar,
  HelpCircle,
  ArrowRightLeft,
  LogOut,
  Home,
} from "lucide-react";

export function MobileTopBar() {
  const { lang, t } = useI18n();
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLangLabel = LANGS.find((l) => l.id === lang)?.label ?? "English";

  // Close menu on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setLangModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/rates", label: t("navLive"), icon: TrendingUp },
    { to: "/buy", label: t("navBuy"), icon: ShoppingBag },
    { to: "/sell", label: t("navSell"), icon: Sprout },
    { to: "/slots", label: t("navSlots") || "Slot Booking", icon: Calendar },
    { to: "/how-it-works", label: t("navHow"), icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/60 bg-white/90 backdrop-blur-xl shadow-xs transition-colors">
        <div className="flex h-14 items-center justify-between px-2.5 sm:px-3.5 gap-1.5">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2 min-h-[44px] min-w-0 shrink">
            <span className="grid size-8 place-items-center rounded-xl bg-brand text-primary-foreground shadow-sm shrink-0">
              <span className="text-base font-bold leading-none">◖</span>
            </span>
            <div className="leading-tight min-w-0 truncate">
              <span className="block font-display text-sm sm:text-[15px] font-bold tracking-tight text-brand-deep truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">
                {t("brand")}
              </span>
              <span className="-mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-brand-deep/60 truncate hidden xs:block">
                {t("tagline")}
              </span>
            </div>
          </Link>

          {/* Right Action Icons: Language, Sign In, Hamburger */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-1 min-h-[40px] px-2 sm:px-2.5 py-1.5 rounded-full border border-brand-deep/15 bg-white/80 text-brand-deep font-semibold text-xs shadow-xs active:bg-brand/10 transition shrink-0"
              aria-label="Change language"
            >
              <Globe className="size-3.5 text-brand shrink-0" />
              <span className="text-[11px] font-bold max-w-[50px] sm:max-w-[65px] truncate leading-tight">
                {currentLangLabel}
              </span>
            </button>

            {/* Sign In / Profile Icon */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => navigate({ to: "/login" })}
                className="flex items-center gap-1 min-h-[40px] px-2 py-1 rounded-full border border-brand/30 bg-brand/10 text-brand font-semibold text-xs active:scale-95 transition shrink-0"
                aria-label="View user profile"
              >
                <span
                  className={`grid size-6 place-items-center rounded-full text-white text-[10px] shrink-0 ${
                    user.role === "seller" ? "bg-emerald-600" : "bg-amber-600"
                  }`}
                >
                  {user.role === "seller" ? (
                    <Sprout className="size-3" />
                  ) : (
                    <Store className="size-3" />
                  )}
                </span>
                <span className="text-[11px] font-bold max-w-[45px] sm:max-w-[60px] truncate text-brand-deep">
                  {user.name.split(" ")[0]}
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="grid size-9 sm:size-10 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand hover:bg-brand hover:text-white transition active:scale-95 shadow-xs shrink-0"
                aria-label="Sign in"
              >
                <User className="size-4 sm:size-5" />
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="grid size-9 sm:size-10 place-items-center rounded-xl border border-brand/20 bg-white/80 text-brand-deep hover:bg-white hover:text-brand transition active:scale-95 shadow-2xs shrink-0"
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* 26 Indian Languages Horizontal Scrolling Row for Mobile */}
        <div className="px-1.5 sm:px-2 pb-2 pt-0.5 border-t border-brand-deep/5 overflow-hidden">
          <HorizontalLanguageSelector isMobile />
        </div>
      </header>

      {/* Mobile Full Navigation Slide-down / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[96px] bottom-16 z-30 overflow-y-auto bg-white/95 backdrop-blur-2xl p-4 border-b border-brand-deep/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-deep/10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-deep/60">
                Marketplace Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Close ✕
              </button>
            </div>

            {/* Navigation Links Grid */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-brand-deep transition hover:bg-brand/10 hover:text-brand active:bg-brand/15"
                    activeProps={{ className: "bg-brand/15 text-brand font-bold" }}
                  >
                    <div className="grid size-8 place-items-center rounded-xl bg-brand/10 text-brand shrink-0">
                      <Icon className="size-4.5" />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Account & Role Section */}
            <div className="pt-3 border-t border-brand-deep/10">
              {isAuthenticated && user ? (
                <div className="rounded-2xl border border-brand/20 bg-brand/5 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-brand-deep">{user.name}</p>
                      <p className="text-[11px] text-brand-deep/60">
                        {user.role === "seller" ? t("farmerBadge") : t("buyerBadge")} · {user.phone}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        user.role === "seller"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {user.role === "seller" ? "Seller" : "Buyer"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const target = user.role === "seller" ? "buyer" : "seller";
                        switchRole(target);
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-brand/30 bg-white py-2 text-xs font-semibold text-brand-deep shadow-2xs"
                    >
                      <ArrowRightLeft className="size-3.5 text-brand" />
                      <span>Switch to {user.role === "seller" ? "Buyer" : "Farmer"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                    >
                      <LogOut className="size-3.5" />
                      <span>{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-brand/20 bg-brand/5 p-3 text-center space-y-2">
                  <p className="text-xs font-bold text-brand-deep">Access Your Agricultural Portal</p>
                  <p className="text-[11px] text-brand-deep/60">
                    Sign in with sample 1-click accounts or your phone number
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-brand py-2.5 text-xs font-bold text-white shadow-xs"
                  >
                    <span>{t("signIn")}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Language Picker Modal */}
      <LanguageModal open={langModalOpen} onClose={() => setLangModalOpen(false)} />
    </>
  );
}
