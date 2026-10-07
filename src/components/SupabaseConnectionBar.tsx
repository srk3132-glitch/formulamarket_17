import { useState } from "react";
import { getStoredSupabaseConfig, saveSupabaseConfig } from "@/lib/supabase";
import { useListings } from "@/lib/listings-store";
import { Database, Wifi, WifiOff, CheckCircle2, ChevronRight, Settings, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function SupabaseConnectionBar() {
  const { realtimeStatus, isSupabaseReady, refreshListings } = useListings();
  const [isOpen, setIsOpen] = useState(false);
  const config = getStoredSupabaseConfig();
  const [urlInput, setUrlInput] = useState(config.url || "");
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error("Please enter a valid Supabase Project URL");
      return;
    }
    const cleanUrl = urlInput.trim();
    saveSupabaseConfig(cleanUrl);
    refreshListings();
    toast.success("Supabase Project URL saved! Connecting to realtime database...");
    setIsOpen(false);
  };

  const copySqlCode = () => {
    const sql = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY DEFAULT ('lst_' || REPLACE(gen_random_uuid()::text, '-', '')),
  crop_id TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL,
  farmer TEXT NOT NULL,
  phone TEXT NOT NULL,
  state_id TEXT NOT NULL,
  district_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  place_name TEXT NOT NULL,
  distance_km NUMERIC DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.listings FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    toast.success("SQL schema copied to clipboard! Paste it into Supabase SQL editor.");
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="mb-6">
      {/* Status Bar Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-900/15 bg-white/70 px-4 py-2.5 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-2.5 text-xs">
          {realtimeStatus === "connected" && isSupabaseReady ? (
            <>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600"></span>
              </span>
              <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                <Database className="size-3.5 text-emerald-700" />
                Supabase Realtime Active
              </span>
              <span className="text-emerald-900/70 hidden sm:inline">
                · Farmer posts reflect instantly in Buyer feeds
              </span>
            </>
          ) : isSupabaseReady ? (
            <>
              <span className="size-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-semibold text-amber-950 flex items-center gap-1.5">
                <Wifi className="size-3.5 text-amber-700" />
                Connecting to Supabase...
              </span>
            </>
          ) : (
            <>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-teal-600"></span>
              </span>
              <span className="font-semibold text-brand-deep flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-teal-700" />
                Key Loaded: <code className="rounded bg-teal-100 px-1 py-0.5 text-[10px] font-mono text-teal-900">sb_publishable_...</code>
              </span>
              <span className="text-brand-deep/70 hidden md:inline">
                · Ready to sync across devices (Click to configure Project URL)
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-white/80 px-2.5 py-1 text-xs font-semibold text-brand-deep shadow-2xs hover:bg-white transition"
          >
            <Settings className="size-3 text-brand" />
            <span>{isSupabaseReady ? "Supabase Settings" : "Configure Project URL"}</span>
            <ChevronRight className={`size-3 text-brand transition-transform ${isOpen ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expandable Configuration Drawer */}
      {isOpen && (
        <div className="mt-3 rounded-2xl border border-emerald-900/20 bg-white/90 p-5 shadow-lg backdrop-blur-2xl transition-all">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-semibold text-brand-deep flex items-center gap-2 text-sm">
                <Database className="size-4 text-emerald-700" />
                Supabase Realtime Database Configuration
              </h3>
              <p className="text-xs text-brand-deep/70 mt-0.5">
                Your publishable key <code className="rounded bg-emerald-50 px-1 py-0.5 font-mono text-[11px] text-emerald-800">sb_publishable_hRm0DFsc...</code> is installed. Add your Project URL to complete cloud replication.
              </p>
            </div>
            <button
              type="button"
              onClick={copySqlCode}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-700/30 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition"
            >
              {copiedSql ? <Check className="size-3 text-emerald-700" /> : <Copy className="size-3 text-emerald-700" />}
              <span>{copiedSql ? "Copied SQL!" : "Copy SQL Schema"}</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-brand-deep mb-1">
                Supabase Project URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://your-project-id.supabase.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand/90 transition"
                >
                  Save & Connect
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-brand-deep/60">
                Found in your Supabase dashboard at: <strong>Project Settings → API → Project URL</strong>.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3 text-[11px] text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">How Realtime Synchronization Works:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                <li>When a farmer publishes a harvest in <strong>/sell</strong>, an insert event is pushed to Supabase.</li>
                <li>Supabase Realtime sends a <code className="bg-gray-200 px-1 rounded">postgres_changes</code> event to every connected buyer on <strong>/buy</strong>.</li>
                <li>Buyer screens immediately display the new lot with a <span className="text-emerald-700 font-semibold">LIVE NEW</span> badge and notification without requiring page reload.</li>
              </ul>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
