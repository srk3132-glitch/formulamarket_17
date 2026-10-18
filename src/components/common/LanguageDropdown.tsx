import { useState, useRef, useEffect, useMemo } from "react";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { Globe, ChevronDown, Check, Search, X } from "lucide-react";

interface LanguageDropdownProps {
  className?: string;
  align?: "left" | "right";
  showQuickPills?: boolean;
}

export function LanguageDropdown({
  className = "",
  align = "right",
  showQuickPills = false,
}: LanguageDropdownProps) {
  const { lang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Current language info
  const currentLang = useMemo(() => {
    return (
      LANGS.find((l) => l.id === lang) || {
        id: lang,
        label: "English",
        englishLabel: "English",
        region: "All-India",
      }
    );
  }, [lang]);

  // Filter 26 languages based on search query
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return LANGS;
    return LANGS.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.englishLabel.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectLanguage = (selectedLangId: Lang) => {
    setLang(selectedLangId);
    setIsOpen(false);
  };

  // Top popular quick pills for instant 1-click access
  const topQuickLangs = ["en", "hi", "te", "ta", "bn", "mr"] as const;

  return (
    <div className={`relative flex items-center gap-2 ${className}`} ref={dropdownRef}>
      {/* Optional Top Quick Language Pills (shown only on extra wide screens to avoid header crowding) */}
      {showQuickPills && (
        <div className="hidden 2xl:flex items-center gap-1 rounded-full border border-white/70 bg-white/55 p-0.5 backdrop-blur-xl shadow-xs shrink-0">
          {topQuickLangs.map((id) => {
            const item = LANGS.find((l) => l.id === id);
            if (!item) return null;
            const isActive = lang === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectLanguage(id as Lang)}
                className={
                  isActive
                    ? "rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm transition-all whitespace-nowrap"
                    : "rounded-full px-2 py-1 text-[11px] font-semibold text-brand-deep/70 transition hover:bg-white/70 hover:text-brand-deep whitespace-nowrap"
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main 26-Language Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select from all 26 official languages"
        className="group flex items-center gap-1.5 sm:gap-2 rounded-full border border-brand/25 bg-white/80 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-brand-deep shadow-xs backdrop-blur-xl transition hover:border-brand/50 hover:bg-white active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 whitespace-nowrap"
      >
        <span className="grid size-5 place-items-center rounded-full bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition shrink-0">
          <Globe className="size-3.5" />
        </span>
        <span className="flex items-center gap-1.5 leading-tight py-0.5">
          <span className="font-bold text-brand-deep text-xs sm:text-[13px] whitespace-nowrap">
            {currentLang.label}
          </span>
          <span className="text-[11px] font-medium text-brand-deep/60 hidden xl:inline whitespace-nowrap">
            ({currentLang.englishLabel})
          </span>
        </span>
        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold text-brand hidden sm:inline-flex">
          26
        </span>
        <ChevronDown
          className={`size-3.5 text-brand-deep/60 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-brand" : "group-hover:text-brand-deep"
          }`}
        />
      </button>

      {/* Vertical Down-By-Down Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="26 Official Indian Languages"
          className={`absolute top-full mt-2 z-50 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/80 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-brand-deep/10">
            <div>
              <p className="text-xs font-bold text-brand-deep">Select Language</p>
              <p className="text-[10px] text-brand-deep/60">26 Official Regional Indian Languages</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              26 Options
            </span>
          </div>

          {/* Quick 1-Click Popular Language Pills inside Dropdown */}
          <div className="flex flex-wrap items-center gap-1 px-1 pt-2 pb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-deep/50 w-full mb-0.5">
              Popular:
            </span>
            {topQuickLangs.map((id) => {
              const item = LANGS.find((l) => l.id === id);
              if (!item) return null;
              const isActive = lang === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectLanguage(id as Lang)}
                  className={
                    isActive
                      ? "rounded-lg bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow-xs"
                      : "rounded-lg border border-brand/20 bg-brand/5 px-2 py-0.5 text-[10px] font-medium text-brand-deep hover:bg-brand/10"
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Search Input for Fast Access */}
          <div className="relative my-2 px-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-brand-deep/50 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language (e.g. Hindi, Tamil)..."
              className="w-full rounded-xl border border-brand/20 bg-white/90 pl-8 pr-7 py-1.5 text-xs font-medium text-brand-deep placeholder:text-brand-deep/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-deep/40 hover:text-brand-deep"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Vertically Stacked List: All 26 Languages Down by Down */}
          <div className="max-h-72 overflow-y-auto space-y-0.5 pr-1 py-1">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-brand-deep/60">
                No matching language found
              </div>
            ) : (
              filteredLanguages.map((l, index) => {
                const isSelected = lang === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectLanguage(l.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                      isSelected
                        ? "bg-brand text-white shadow-sm font-semibold"
                        : "hover:bg-brand/10 text-brand-deep"
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
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`text-sm font-bold tracking-tight ${
                              isSelected ? "text-white" : "text-brand-deep"
                            }`}
                          >
                            {l.label}
                          </span>
                          <span
                            className={`text-xs ${
                              isSelected ? "text-white/85" : "text-brand-deep/65"
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
                      <span className="grid size-5 place-items-center rounded-full bg-white/20 text-white shrink-0 ml-2">
                        <Check className="size-3 stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Footer hint */}
          <div className="border-t border-brand-deep/10 pt-1.5 px-2 text-center">
            <span className="text-[10px] text-brand-deep/50">
              Selected: <strong className="text-brand">{currentLang.label}</strong> ({currentLang.englishLabel})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
