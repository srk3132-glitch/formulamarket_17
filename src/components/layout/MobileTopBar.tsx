import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useI18n, LANGS } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-store";
import { LanguageModal } from "@/components/common/LanguageModal";
import { Globe, User, Sprout, Store, LogIn } from "lucide-react";

export function MobileTopBar() {
  const { lang, t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [langModalOpen, setLangModalOpen] = useState(false);

  const currentLangLabel = LANGS.find((l) => l.id === lang)?.label ?? "English";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/60 bg-white/90 backdrop-blur-xl shadow-xs transition-colors">
        <div className="flex h-14 items-center justify-between px-3.5">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2 touch-target">
            <span className="grid size-8 place-items-center rounded-xl bg-brand text-primary-foreground shadow-sm">
              <span className="text-base font-bold leading-none">◖</span>
            </span>
            <div className="leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-tight text-brand-deep">
                {t("brand")}
              </span>
              <span className="-mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-brand-deep/60">
                {t("tagline")}
              </span>
            </div>
          </Link>

          {/* Right Action Icons: Language & Sign In */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-full border border-brand-deep/15 bg-white/80 text-brand-deep font-semibold text-xs shadow-xs active:bg-brand/10 transition"
              aria-label="Change language"
            >
              <Globe className="size-3.5 text-brand" />
              <span className="text-[11px] font-bold max-w-[65px] truncate">
                {currentLangLabel}
              </span>
            </button>

            {/* Sign In / Profile Icon */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => navigate({ to: "/login" })}
                className="flex items-center gap-1 min-h-[44px] min-w-[44px] px-2 rounded-full border border-brand/30 bg-brand/10 text-brand font-semibold text-xs active:scale-95 transition"
                aria-label="View user profile"
              >
                <span
                  className={`grid size-6 place-items-center rounded-full text-white text-[10px] ${
                    user.role === "seller" ? "bg-emerald-600" : "bg-amber-600"
                  }`}
                >
                  {user.role === "seller" ? (
                    <Sprout className="size-3.5" />
                  ) : (
                    <Store className="size-3.5" />
                  )}
                </span>
                <span className="text-[11px] font-bold max-w-[50px] truncate text-brand-deep">
                  {user.name.split(" ")[0]}
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="grid size-11 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand hover:bg-brand hover:text-white transition active:scale-95 shadow-xs"
                aria-label="Sign in"
              >
                <User className="size-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Language Picker Modal */}
      <LanguageModal open={langModalOpen} onClose={() => setLangModalOpen(false)} />
    </>
  );
}
