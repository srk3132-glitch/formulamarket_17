import * as React from "react";

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

export interface DeviceLayout {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMounted: boolean;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function useDeviceLayout(): DeviceLayout {
  const [layout, setLayout] = React.useState<DeviceLayout>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isMounted: false,
  });

  React.useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setLayout({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= MOBILE_BREAKPOINT,
        isMounted: true,
      });
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}
