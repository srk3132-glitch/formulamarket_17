import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useDeviceLayout } from "@/hooks/use-mobile";

const LoginMobileView = lazy(() => import("@/components/login/LoginMobileView"));
const LoginDesktopView = lazy(() => import("@/components/login/LoginDesktopView"));

interface LoginSearchParams {
  role?: "seller" | "buyer" | undefined;
  redirect?: string | undefined;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
    const roleVal = search["role"];
    const redirectVal = search["redirect"];
    return {
      role: roleVal === "buyer" || roleVal === "seller" ? roleVal : undefined,
      redirect: typeof redirectVal === "string" ? redirectVal : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In — Formula Market Agricultural Portal" },
      {
        name: "description",
        content:
          "Separate sign in portals for Farmers / Sellers to list harvests and Buyers / Traders to procure produce directly with live mandi benchmark rates.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const { isMobile, isMounted } = useDeviceLayout();

  if (!isMounted) {
    return (
      <>
        <div className="block md:hidden p-3.5">
          <div className="min-h-screen rounded-2xl bg-white/30 animate-pulse" />
        </div>
        <div className="hidden md:block max-w-5xl mx-auto px-5 pt-8">
          <div className="min-h-screen rounded-3xl bg-white/30 animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-4 sm:p-8 animate-pulse bg-white/30 rounded-3xl max-w-5xl mx-auto my-4" />
      }
    >
      {isMobile ? (
        <LoginMobileView redirect={search.redirect} />
      ) : (
        <LoginDesktopView initialRole={search.role} redirect={search.redirect} />
      )}
    </Suspense>
  );
}
