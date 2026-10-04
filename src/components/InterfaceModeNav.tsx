import { Link, useRouterState } from "@tanstack/react-router";
import { TrendingUp, ShoppingBag, PlusCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useRegion } from "@/lib/region-store";

interface InterfaceModeNavProps {
  currentMode: "rates" | "buy" | "sell";
}

export function InterfaceModeNav({ currentMode }: InterfaceModeNavProps) {
  const { t } = useI18n();
  const { placeName } = useRegion();

  return (
    <div className="relative z-10 mx-auto mb-6 max-w-4xl px-2 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/80 bg-white/65 p-1.5 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl sm:flex-nowrap">
        {/* 1. Live Mandi Rates Interface */}
        <Link
          to="/rates"
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-[0.98] ${
            currentMode === "rates"
              ? "bg-teal-700 text-white shadow-md ring-1 ring-teal-800/40 scale-[1.01]"
              : "text-brand-deep/70 hover:bg-white/80 hover:text-brand-deep hover:-translate-y-0.5"
          }`}
        >
          {currentMode === "rates" && (
            <span className="livedot absolute top-2 right-2.5 size-2 rounded-full bg-accent" />
          )}
          <TrendingUp
            className={`size-4 transition-transform duration-300 ${currentMode === "rates" ? "scale-110 text-accent" : ""}`}
          />
          <div className="text-left leading-tight">
            <p className="font-bold tracking-tight">Live Mandi Rates</p>
            <p
              className={`text-[10px] hidden sm:block transition-opacity duration-300 ${
                currentMode === "rates" ? "text-teal-100" : "text-brand-deep/50"
              }`}
            >
              Real-time APMC benchmarks
            </p>
          </div>
        </Link>

        {/* 2. Buy Harvests Marketplace Interface */}
        <Link
          to="/buy"
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-[0.98] ${
            currentMode === "buy"
              ? "bg-amber-800 text-white shadow-md ring-1 ring-amber-900/40 scale-[1.01]"
              : "text-brand-deep/70 hover:bg-white/80 hover:text-brand-deep hover:-translate-y-0.5"
          }`}
        >
          {currentMode === "buy" && (
            <span className="livedot absolute top-2 right-2.5 size-2 rounded-full bg-amber-300" />
          )}
          <ShoppingBag
            className={`size-4 transition-transform duration-300 ${currentMode === "buy" ? "scale-110 text-amber-300" : ""}`}
          />
          <div className="text-left leading-tight">
            <p className="font-bold tracking-tight">Buy Produce</p>
            <p
              className={`text-[10px] hidden sm:block transition-opacity duration-300 ${
                currentMode === "buy" ? "text-amber-100" : "text-brand-deep/50"
              }`}
            >
              Direct farm lot procurement
            </p>
          </div>
        </Link>

        {/* 3. List / Sell Produce Interface */}
        <Link
          to="/sell"
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-[0.98] ${
            currentMode === "sell"
              ? "bg-emerald-700 text-white shadow-md ring-1 ring-emerald-800/40 scale-[1.01]"
              : "text-brand-deep/70 hover:bg-white/80 hover:text-brand-deep hover:-translate-y-0.5"
          }`}
        >
          {currentMode === "sell" && (
            <span className="livedot absolute top-2 right-2.5 size-2 rounded-full bg-emerald-300" />
          )}
          <PlusCircle
            className={`size-4 transition-transform duration-300 ${currentMode === "sell" ? "scale-110 text-emerald-300" : ""}`}
          />
          <div className="text-left leading-tight">
            <p className="font-bold tracking-tight">List Your Harvest</p>
            <p
              className={`text-[10px] hidden sm:block transition-opacity duration-300 ${
                currentMode === "sell" ? "text-emerald-100" : "text-brand-deep/50"
              }`}
            >
              0% commission farmer direct
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
