import { useState } from "react";
import { LANGS, useI18n } from "@/lib/i18n";
import { Check, Globe, X } from "lucide-react";

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
}

export function LanguageModal({ open, onClose }: LanguageModalProps) {
  const { lang, setLang, t } = useI18n();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom duration-250"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-brand-deep/10">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand">
              <Globe className="size-5" />
            </div>
            <div>
              <h2 id="language-modal-title" className="font-display text-base font-bold text-brand-deep">
                Select Your Language
              </h2>
              <p className="text-[11px] text-brand-deep/60">
                Choose your preferred regional language
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full hover:bg-black/5 text-brand-deep/70 transition"
            aria-label="Close language selector"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="overflow-y-auto py-3 space-y-1.5 flex-1 pr-1">
          {LANGS.map((l) => {
            const isSelected = lang === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLang(l.id);
                  onClose();
                }}
                className={`flex w-full items-center justify-between min-h-[48px] rounded-2xl px-4 py-3 text-left transition-all duration-150 active:scale-[0.99] ${
                  isSelected
                    ? "bg-brand text-primary-foreground font-bold shadow-sm"
                    : "bg-white/70 hover:bg-brand/10 text-brand-deep border border-brand-deep/5 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base tracking-wide font-display">{l.label}</span>
                  {l.id === "ta" && (
                    <span className="text-[11px] opacity-80">(Tamil)</span>
                  )}
                  {l.id === "te" && (
                    <span className="text-[11px] opacity-80">(Telugu)</span>
                  )}
                  {l.id === "ml" && (
                    <span className="text-[11px] opacity-80">(Malayalam)</span>
                  )}
                  {l.id === "en" && (
                    <span className="text-[11px] opacity-80">(English)</span>
                  )}
                </div>
                {isSelected && (
                  <span className="grid size-6 place-items-center rounded-full bg-white text-brand shadow-xs">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

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
