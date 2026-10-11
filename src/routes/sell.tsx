import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";

const SellMobileView = lazy(() => import("@/components/sell/SellMobileView"));
const SellDesktopView = lazy(() => import("@/components/sell/SellDesktopView"));

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "List Your Harvest — Formula Market" },
      {
        name: "description",
        content:
          "Farmers: choose your state, district and market, set your price against today's mandi rate, and let buyers contact you directly.",
      },
      { property: "og:title", content: "List Your Harvest — Formula Market" },
      {
        property: "og:description",
        content: "Post your produce by region and sell direct to buyers, with no middleman.",
      },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  const { isMobile, isMounted } = useDeviceLayout();

  if (!isMounted) {
    return (
      <>
        <div className="block md:hidden p-3.5">
          <div className="min-h-screen rounded-2xl bg-white/30 animate-pulse" />
        </div>
        <div className="hidden md:block max-w-6xl mx-auto px-5 pt-8">
          <div className="min-h-screen rounded-3xl bg-white/30 animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-4 sm:p-8 animate-pulse bg-white/30 rounded-3xl max-w-6xl mx-auto my-4" />
      }
    >
      {isMobile ? <SellMobileView /> : <SellDesktopView />}
    </Suspense>
  );
}
