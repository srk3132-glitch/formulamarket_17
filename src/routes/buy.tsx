import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";

const BuyMobileView = lazy(() => import("@/components/buy/BuyMobileView"));
const BuyDesktopView = lazy(() => import("@/components/buy/BuyDesktopView"));

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy Direct From Farmers — Formula Market" },
      {
        name: "description",
        content:
          "Browse fresh harvests listed by farmers across Tamil Nadu, Andhra Pradesh, Telangana and Kerala, with live mandi prices for reference.",
      },
      { property: "og:title", content: "Buy Direct From Farmers — Formula Market" },
      {
        property: "og:description",
        content: "Fresh produce listed straight from the field, with today's mandi rates alongside.",
      },
    ],
  }),
  component: BuyPage,
});

function BuyPage() {
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
      {isMobile ? <BuyMobileView /> : <BuyDesktopView />}
    </Suspense>
  );
}
