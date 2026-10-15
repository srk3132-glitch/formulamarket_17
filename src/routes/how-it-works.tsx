import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";

const HowItWorksMobileView = lazy(() => import("@/components/how/HowItWorksMobileView"));
const HowItWorksDesktopView = lazy(() => import("@/components/how/HowItWorksDesktopView"));

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Formula Market Works — Price Discovery for Farmers" },
      {
        name: "description",
        content:
          "Pick your state, district and mandi, read today's live crop rates, then list your harvest and sell direct to buyers in your own language.",
      },
      { property: "og:title", content: "How Formula Market Works" },
      {
        property: "og:description",
        content: "Three steps: choose your region, read today's rate, list and sell direct.",
      },
    ],
  }),
  component: HowPage,
});

function HowPage() {
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
      {isMobile ? <HowItWorksMobileView /> : <HowItWorksDesktopView />}
    </Suspense>
  );
}
