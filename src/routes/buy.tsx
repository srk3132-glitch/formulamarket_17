import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";
import { useListings } from "@/lib/listings-store";
import { useI18n, cropName } from "@/lib/i18n";
import { toast } from "sonner";

const BuyMobileView = lazy(() => import("@/components/buy/BuyMobileView"));
const BuyDesktopView = lazy(() => import("@/components/buy/BuyDesktopView"));

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy Direct From Farmers — Formula Market" },
      {
        name: "description",
        content:
          "Browse fresh harvests listed by farmers across India with live mandi prices for benchmark reference.",
      },
      { property: "og:title", content: "Buy Direct From Farmers — Formula Market" },
      {
        property: "og:description",
        content: "Fresh produce lots available straight from the field, with today's mandi rates alongside.",
      },
    ],
  }),
  headers: () => ({
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  }),
  component: BuyPage,
});

function BuyPage() {
  const { isMobile, isMounted } = useDeviceLayout();
  const { latestNewListing } = useListings();
  const { lang } = useI18n();

  useEffect(() => {
    if (latestNewListing) {
      toast.success(
        `🌾 Live Harvest: ${latestNewListing.farmer} listed ${latestNewListing.quantity} quintals of ${cropName(latestNewListing.cropId, lang)}!`,
        { duration: 5000 },
      );
    }
  }, [latestNewListing, lang]);

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
