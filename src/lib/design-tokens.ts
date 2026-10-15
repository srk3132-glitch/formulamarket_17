/**
 * Shared Design Tokens for FormulaMarket
 * Earthy green/amber palette, high contrast for bright outdoor sunlight,
 * large readable typography, and accessible tap targets (>= 48px).
 */

export const DESIGN_TOKENS = {
  colors: {
    // Primary Brand - Earthy Forest Green
    brand: {
      light: "#0E7C66",
      DEFAULT: "#0B6654",
      deep: "#07483B",
      surface: "#EAF3EE",
      surfaceHover: "#D8EAE1",
      border: "rgba(11, 102, 84, 0.2)",
    },
    // Accent - Golden Harvest Amber
    amber: {
      light: "#D97706",
      DEFAULT: "#B45309",
      deep: "#92400E",
      surface: "#FEF3C7",
      surfaceHover: "#FDE68A",
      border: "rgba(180, 83, 9, 0.25)",
    },
    // Neutrals & High-Contrast Typography
    ink: {
      DEFAULT: "#132E27",
      muted: "#35594F",
      subtle: "#587C73",
      disabled: "#8FA8A0",
    },
    // Outdoor Sun Contrast (Extra high contrast for daylight legibility)
    outdoor: {
      bg: "#F4F8F6",
      card: "#FFFFFF",
      border: "#CBDDD6",
      badgeGreen: "#065F46",
      badgeAmber: "#78350F",
    },
    // Status indicators
    status: {
      up: "#047857",
      down: "#DC2626",
      active: "#059669",
      paused: "#D97706",
      sold: "#4B5563",
      expired: "#9CA3AF",
    },
  },
  typography: {
    fontBody: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontDisplay: "Fraunces, Georgia, serif",
    sizes: {
      caption: "0.75rem", // 12px
      small: "0.875rem", // 14px
      body: "1rem", // 16px (minimum mobile body for legibility)
      bodyLarge: "1.125rem", // 18px
      h3: "1.25rem", // 20px
      h2: "1.5rem", // 24px
      h1: "2rem", // 32px
      hero: "2.5rem", // 40px
    },
  },
  sizing: {
    // Mobile accessibility requirements
    minTapTarget: "48px",
    minControlSpacing: "12px",
    // Breakpoints matching prompt: Mobile < 768px, Desktop >= 1024px
    mobileMax: "767px",
    tabletMin: "768px",
    desktopMin: "1024px",
    maxWidthDesktop: "1280px",
  },
  radius: {
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
    full: "9999px",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
