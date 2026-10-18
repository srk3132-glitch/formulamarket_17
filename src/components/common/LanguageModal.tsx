import { useState, useMemo, useEffect } from "react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { Check, Globe, X, Search } from "lucide-react";

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
}

export function LanguageModal({ open, onClose }: LanguageModalProps) {
  const { lang, setLang, t } = useI18n();
  const [search, setSearch] = useState("");

  const popularLangs: Lang[] = ["en", "hi", "te", "ta", "bn", "mr"];

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Reset search when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LANGS;
    return LANGS.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.englishLabel.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q),
    );
  }, [search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/80 bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom duration-250"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-deep/10">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand shrink-0">
              <Globe className="size-5" />
            </div>
            <div>
              <h2 id="language-modal-title" className="font-display text-base font-bold text-brand-deep">
                Select Language
              </h2>
              <p className="text-[11px] text-brand-deep/60">
                All 26 Official Indian Languages
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full hover:bg-black/5 text-brand-deep/70 transition shrink-0"
            aria-label="Close language selector"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Quick popular language pills */}
        <div className="pt-2.5 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-deep/50 mb-1.5">
            Quick Select Popular:
          </p>
          <div className="flex flex-wrap gap-1">
            {popularLangs.map((id) => {
              const item = LANGS.find((l) => l.id === id);
              if (!item) return null;
              const isActive = lang === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setLang(id);
                    onClose();
                  }}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold transition min-h-[32px] ${
                    isActive
                      ? "bg-brand text-white shadow-xs"
                      : "border border-brand/20 bg-brand/5 text-brand-deep hover:bg-brand/15"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search input */}
        <div className="relative my-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-brand-deep/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search language (e.g. Telugu, Hindi)..."
            className="w-full rounded-xl border border-brand/20 bg-white pl-9 pr-8 py-2.5 text-xs sm:text-sm font-medium text-brand-deep outline-none focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-deep/40 hover:text-brand-deep"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Full 26 Languages Scrollable List */}
        <div className="overflow-y-auto py-2 space-y-1 flex-1 pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-brand-deep/60">
              No matching languages found for "{search}"
            </div>
          ) : (
            filtered.map((l, index) => {
              const isSelected = lang === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setLang(l.id);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between min-h-[48px] rounded-2xl px-3.5 py-2.5 text-left transition-all duration-150 active:scale-[0.99] ${
                    isSelected
                      ? "bg-brand text-primary-foreground font-bold shadow-sm"
                      : "bg-white/70 hover:bg-brand/10 text-brand-deep border border-brand-deep/5 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[10px] font-mono font-bold w-4 text-center shrink-0 ${
                        isSelected ? "text-white/70" : "text-brand-deep/40"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="truncate">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold tracking-tight leading-tight">
                          {l.label}
                        </span>
                        <span
                          className={`text-xs ${
                            isSelected ? "text-white/85" : "text-brand-deep/60"
                          }`}
                        >
                          ({l.englishLabel})
                        </span>
                      </div>
                      <p
                        className={`text-[10px] truncate ${
                          isSelected ? "text-white/75" : "text-brand-deep/50"
                        }`}
                      >
                        {l.region}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="grid size-6 place-items-center rounded-full bg-white text-brand shadow-xs shrink-0 ml-2">
                      <Check className="size-4 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-brand-deep/10 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] rounded-xl bg-brand/10 py-2.5 text-xs font-bold text-brand hover:bg-brand/20 transition"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
