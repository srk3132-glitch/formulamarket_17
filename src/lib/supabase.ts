import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Default fallback key supplied by user
export const DEFAULT_SUPABASE_KEY = "sb_publishable_hRm0DFsc2vKNtqRcCAojJg_OiA8w2WM";

export function getStoredSupabaseConfig() {
  // Check both Vite and Next.js / standard process.env conventions
  const metaEnv =
    typeof import.meta !== "undefined"
      ? (import.meta.env as Record<string, string | undefined>) || {}
      : {};
  const procEnv =
    typeof process !== "undefined" ? (process.env as Record<string, string | undefined>) || {} : {};

  const envUrl = (
    metaEnv.NEXT_PUBLIC_SUPABASE_URL ||
    metaEnv.VITE_SUPABASE_URL ||
    procEnv.NEXT_PUBLIC_SUPABASE_URL ||
    procEnv.VITE_SUPABASE_URL ||
    ""
  ).trim();

  const envKey = (
    metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    procEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    procEnv.VITE_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  let storedUrl = "";
  let storedKey = "";

  if (typeof window !== "undefined") {
    try {
      storedUrl = (window.localStorage.getItem("fm_supabase_url") || "").trim();
      storedKey = (window.localStorage.getItem("fm_supabase_key") || "").trim();
    } catch {
      // ignore localStorage error in SSR or strict mode
    }
  }

  // Prioritize environment variables from Vercel / .env, fallback to stored config
  const url = envUrl || storedUrl;
  const key = envKey || storedKey || DEFAULT_SUPABASE_KEY;

  const isValidUrl =
    Boolean(url) &&
    !url.includes("your-project-id") &&
    !url.includes("example.supabase.co") &&
    (url.startsWith("https://") || url.startsWith("http://"));

  if (!isValidUrl && typeof window === "undefined") {
    console.warn(
      "[Supabase Config] Missing valid Supabase Project URL. Please set NEXT_PUBLIC_SUPABASE_URL or VITE_SUPABASE_URL in your Vercel / environment settings.",
    );
  }

  return {
    url,
    key,
    isConfigured: isValidUrl && Boolean(key),
  };
}

let supabaseInstance: SupabaseClient | null = null;
let currentConfigKey = "";

export function getSupabase(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  const cacheKey = `${config.url}::${config.key}`;
  if (supabaseInstance && currentConfigKey === cacheKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    currentConfigKey = cacheKey;
    return supabaseInstance;
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
    return null;
  }
}

export function saveSupabaseConfig(url: string, key?: string) {
  if (typeof window !== "undefined") {
    if (url) {
      window.localStorage.setItem("fm_supabase_url", url.trim());
    }
    if (key) {
      window.localStorage.setItem("fm_supabase_key", key.trim());
    }
    supabaseInstance = null;
    currentConfigKey = "";
  }
}
