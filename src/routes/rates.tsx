import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";
import { RatesMobileSkeleton, RatesDesktopSkeleton } from "@/components/common/RatesSkeleton";

const RatesMobileView = lazy(() => import("@/components/rates/RatesMobileView"));
const RatesDesktopView = lazy(() => import("@/components/rates/RatesDesktopView"));

export const Route = createFileRoute("/rates")({
  head: () => ({
    meta: [
      { title: "Live APMC Mandi Rates — Formula Market" },
      {
        name: "description",
        content:
          "Real-time benchmark mandi prices for vegetables, fruits, grains and spices across 111 districts of Tamil Nadu, Andhra Pradesh, Telangana and Kerala.",
      },
    ],
  }),
  component: LiveRatesPage,
});

function LiveRatesPage() {
  const { isMobile, isMounted } = useDeviceLayout();

  if (!isMounted) {
    return (
      <>
        <div className="block md:hidden p-3.5">
          <RatesMobileSkeleton count={6} />
        </div>
        <div className="hidden md:block max-w-6xl mx-auto px-5 pt-8">
          <RatesDesktopSkeleton count={9} />
        </div>
      </>
    );
  }

  return (
    <Suspense
      fallback={
        isMobile ? (
          <div className="p-3.5">
            <RatesMobileSkeleton count={6} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-5 pt-8">
            <RatesDesktopSkeleton count={9} />
          </div>
        )
      }
    >
      {isMobile ? <RatesMobileView /> : <RatesDesktopView />}
    </Suspense>
  );
}
