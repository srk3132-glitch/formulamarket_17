import { type ReactNode } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";
import { MobileTopBar } from "./MobileTopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { DesktopHeader } from "./DesktopHeader";
import { useI18n } from "@/lib/i18n";

export function AppLayout({ children }: { children: ReactNode }) {
  const { isMobile, isMounted } = useDeviceLayout();
  const { t } = useI18n();

  // If not mounted yet (SSR), render a responsive wrapper using CSS media queries
  // to avoid hydration shift
  return (
    <div className="relative min-h-screen text-ink">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="glow-1 absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl" />
        <div className="glow-2 absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-brand-deep/20 blur-3xl" />
      </div>

      {isMounted ? (
        isMobile ? (
          /* Phone Layout */
          <div className="relative z-10 flex min-h-screen flex-col">
            <MobileTopBar />
            <div className="flex-1 pb-20">{children}</div>
            <MobileBottomNav />
          </div>
        ) : (
          /* Desktop & Tablet Layout */
          <div className="relative z-10 flex min-h-screen flex-col">
            <DesktopHeader />
            <div className="flex-1">{children}</div>
            <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10 pt-6 text-center text-xs text-brand-deep/55">
              {t("footer")}
            </footer>
          </div>
        )
      ) : (
        /* SSR Initial render: CSS based responsive fallback */
        <div className="relative z-10 flex min-h-screen flex-col">
          <div className="block md:hidden">
            <MobileTopBar />
          </div>
          <div className="hidden md:block">
            <DesktopHeader />
          </div>
          <div className="flex-1 pb-20 md:pb-0">{children}</div>
          <div className="block md:hidden">
            <MobileBottomNav />
          </div>
          <footer className="hidden md:block relative z-10 mx-auto max-w-6xl px-5 pb-10 pt-6 text-center text-xs text-brand-deep/55">
            {t("footer")}
          </footer>
        </div>
      )}
    </div>
  );
}
