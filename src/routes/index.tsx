import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";

const HomeMobileView = lazy(() => import("@/components/home/HomeMobileView"));
const HomeDesktopView = lazy(() => import("@/components/home/HomeDesktopView"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Formula Market — Live Mandi Prices for Farmers" },
      {
        name: "description",
        content:
          "Real-time mandi prices by state, district and market, in English, Tamil, Telugu and Malayalam. Farmers list produce; buyers purchase direct.",
      },
      { property: "og:title", content: "Formula Market — Live Mandi Prices for Farmers" },
      {
        property: "og:description",
        content:
          "Check live crop prices for your region and sell your harvest direct to buyers, in your own language.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { isMobile, isMounted } = useDeviceLayout();

  // If not mounted yet (SSR), render clean CSS-adaptive shells
  if (!isMounted) {
    return (
      <>
        <div className="block md:hidden">
          <Suspense fallback={<div className="min-h-screen p-4 animate-pulse bg-white/20 rounded-3xl" />}>
            <HomeMobileView />
          </Suspense>
        </div>
        <div className="hidden md:block">
          <Suspense fallback={<div className="min-h-screen p-8 animate-pulse bg-white/20 rounded-3xl max-w-6xl mx-auto" />}>
            <HomeDesktopView />
          </Suspense>
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
      {isMobile ? <HomeMobileView /> : <HomeDesktopView />}
    </Suspense>
  );
}
