import { useRef, useEffect, useState, useCallback } from "react";
import { useI18n, type Lang } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";

export interface LanguageItem {
  id: Lang;
  label: string;
  englishLabel: string;
}

// Exactly 26 official languages in consistent display order
export const ALL_26_LANGUAGES: LanguageItem[] = [
  { id: "hi", label: "हिन्दी", englishLabel: "Hindi" },
  { id: "en", label: "English", englishLabel: "English" },
  { id: "bn", label: "বাংলা", englishLabel: "Bengali" },
  { id: "te", label: "తెలుగు", englishLabel: "Telugu" },
  { id: "mr", label: "मराठी", englishLabel: "Marathi" },
  { id: "ta", label: "தமிழ்", englishLabel: "Tamil" },
  { id: "ur", label: "اردو", englishLabel: "Urdu" },
  { id: "gu", label: "ગુજરાતી", englishLabel: "Gujarati" },
  { id: "kn", label: "ಕನ್ನಡ", englishLabel: "Kannada" },
  { id: "ml", label: "മലയാളം", englishLabel: "Malayalam" },
  { id: "or", label: "ଓଡ଼ିଆ", englishLabel: "Odia" },
  { id: "pa", label: "ਪੰਜਾਬੀ", englishLabel: "Punjabi" },
  { id: "as", label: "অসমীয়া", englishLabel: "Assamese" },
  { id: "mai", label: "मैथिली", englishLabel: "Maithili" },
  { id: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ", englishLabel: "Santali" },
  { id: "ks", label: "کٲشُر", englishLabel: "Kashmiri" },
  { id: "ne", label: "नेपाली", englishLabel: "Nepali" },
  { id: "sd", label: "سنڌي", englishLabel: "Sindhi" },
  { id: "kok", label: "कोंकणी", englishLabel: "Konkani" },
  { id: "doi", label: "डोगरी", englishLabel: "Dogri" },
  { id: "mni", label: "মৈতৈলোন্", englishLabel: "Manipuri" },
  { id: "brx", label: "बर'", englishLabel: "Bodo" },
  { id: "sa", label: "संस्कृतम्", englishLabel: "Sanskrit" },
  { id: "bho", label: "भोजपुरी", englishLabel: "Bhojpuri" },
  { id: "raj", label: "राजस्थानी", englishLabel: "Rajasthani" },
  { id: "tcy", label: "ತುಳು", englishLabel: "Tulu" },
];

interface HorizontalLanguageSelectorProps {
  className?: string;
  isMobile?: boolean;
}

export function HorizontalLanguageSelector({
  className = "",
  isMobile = false,
}: HorizontalLanguageSelectorProps) {
  const { lang, setLang } = useI18n();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Check scroll boundary to toggle arrow visibility and edge fades
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Requirement 3: mouse-wheel (vertical) scroll should move the row sideways
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Requirement 4: When a language is selected, auto-scroll it into view (scrollIntoView, inline: "center")
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLButtonElement>(`[data-lang="${lang}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [lang]);

  // Requirement 3: Arrow buttons that scroll the row smoothly
  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -220 : 220;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Language selector"
      className={`relative flex items-center min-w-0 max-w-full ${className}`}
    >
      {/* Desktop Left Arrow Button */}
      {!isMobile && (
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll languages left"
          disabled={!canScrollLeft}
          className={`hidden sm:flex size-6 items-center justify-center rounded-full text-brand-deep/80 hover:text-brand hover:bg-white/80 active:scale-95 transition-all shrink-0 mr-1 ${
            !canScrollLeft ? "opacity-25 cursor-not-allowed" : "opacity-100 hover:scale-105"
          }`}
        >
          <ChevronLeft className="size-3.5 stroke-[2.5]" />
        </button>
      )}

      {/* Main Glassmorphism Pill Capsule Container */}
      <div className="relative flex items-center min-w-0 w-full rounded-full border border-white/70 bg-white/55 p-0.5 backdrop-blur-xl shadow-xs">
        {/* Requirement 3: Desktop Fade on Left Edge */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-5 rounded-l-full bg-gradient-to-r from-white/95 to-transparent z-10 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Requirement 2: The row must scroll horizontally on both mobile and desktop
            - container: display:flex; flex-wrap:nowrap; overflow-x:auto; width:100%; max-width:100%; min-width:0
            - each pill: flex-shrink:0; white-space:nowrap
            - hide the scrollbar but keep scrolling working */}
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="All 26 Indian languages"
          tabIndex={0}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth w-full max-w-full min-w-0 px-1 py-0.5"
        >
          {ALL_26_LANGUAGES.map((l) => {
            const isActive = lang === l.id;
            return (
              <button
                key={l.id}
                data-lang={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                aria-pressed={isActive}
                title={`${l.label} (${l.englishLabel})`}
                style={{
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
                className={
                  isActive
                    ? "shrink-0 whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand scale-102 leading-tight"
                    : "shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-semibold text-brand-deep/70 transition-colors hover:bg-white/70 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand leading-tight"
                }
              >
                {l.label}
              </button>
            );
          })}
        </div>

        {/* Requirement 3: Desktop Fade on Right Edge */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-5 rounded-r-full bg-gradient-to-l from-white/95 to-transparent z-10 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Desktop Right Arrow Button */}
      {!isMobile && (
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll languages right"
          disabled={!canScrollRight}
          className={`hidden sm:flex size-6 items-center justify-center rounded-full text-brand-deep/80 hover:text-brand hover:bg-white/80 active:scale-95 transition-all shrink-0 ml-1 ${
            !canScrollRight ? "opacity-25 cursor-not-allowed" : "opacity-100 hover:scale-105"
          }`}
        >
          <ChevronRight className="size-3.5 stroke-[2.5]" />
        </button>
      )}

      {/* Down-By-Down Clear 26-Language Dropdown Option */}
      <div className="relative shrink-0 ml-1" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-expanded={dropdownOpen}
          title="Open all 26 languages down by down as options"
          aria-label="Open all 26 languages down by down as options"
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold shadow-xs transition shrink-0 ${
            dropdownOpen
              ? "border-brand bg-brand text-white shadow-sm"
              : "border-brand/25 bg-white/85 text-brand-deep hover:bg-white hover:text-brand"
          }`}
        >
          <span>26</span>
          <ChevronDown
            className={`size-3 transition-transform duration-150 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div
            role="listbox"
            aria-label="All 26 languages down by down"
            className="absolute right-0 top-full mt-2 z-50 w-72 max-w-[calc(100vw-1.5rem)] max-h-72 overflow-y-auto rounded-2xl border border-white/80 bg-white/98 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-brand-deep/10 text-[11px] font-bold text-brand-deep">
              <span>All 26 Languages</span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                Down by Down
              </span>
            </div>
            <div className="space-y-0.5 pt-1">
              {ALL_26_LANGUAGES.map((l, idx) => {
                const isSelected = lang === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLang(l.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition ${
                      isSelected
                        ? "bg-brand text-white font-bold shadow-sm"
                        : "hover:bg-brand/10 text-brand-deep font-medium"
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-mono text-[10px] opacity-60 mr-1.5">{idx + 1}.</span>
                      <strong className="text-[13px]">{l.label}</strong> ({l.englishLabel})
                    </span>
                    {isSelected && <Check className="size-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
