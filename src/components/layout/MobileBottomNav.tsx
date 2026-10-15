import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { TrendingUp, ShoppingBag, Sprout, HelpCircle } from "lucide-react";

export function MobileBottomNav() {
  const { t } = useI18n();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabs = [
    {
      id: "rates",
      to: "/rates",
      label: t("navLive"),
      icon: TrendingUp,
      activeColor: "text-teal-700 bg-teal-50 border-teal-200",
    },
    {
      id: "buy",
      to: "/buy",
      label: t("navBuy"),
      icon: ShoppingBag,
      activeColor: "text-amber-800 bg-amber-50 border-amber-200",
    },
    {
      id: "sell",
      to: "/sell",
      label: t("navSell"),
      icon: Sprout,
      activeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "how",
      to: "/how-it-works",
      label: t("navHow"),
      icon: HelpCircle,
      activeColor: "text-brand bg-brand/10 border-brand/20",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-deep/10 bg-white/95 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.to;

          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-brand font-bold"
                  : "text-brand-deep/60 hover:text-brand-deep font-medium"
              }`}
            >
              <div
                className={`relative grid size-8 place-items-center rounded-xl transition-all duration-200 ${
                  isActive ? "bg-brand/15 text-brand scale-105" : ""
                }`}
              >
                <Icon className={`size-5 stroke-[2.2]`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-accent" />
                )}
              </div>
              <span
                className={`mt-0.5 text-[11px] leading-tight max-w-[76px] truncate text-center ${
                  isActive ? "font-bold text-brand" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
