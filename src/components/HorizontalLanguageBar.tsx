import { useRef, useEffect, useState } from "react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { Globe, ChevronLeft, ChevronRight, Check, Search, Sparkles } from "lucide-react";

export function HorizontalLanguageBar() {
  const { lang, setLang } = useI18n();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Check scroll positions for left/right fade arrows
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  // Smoothly scroll active language into view
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

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = direction === "left" ? -280 : 280;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const filteredLangs = searchQuery.trim()
    ? LANGS.filter(
        (l) =>
          l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.englishLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.region && l.region.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : LANGS;

  return (
    <aside
      aria-label="Indian Languages Switcher"
      className="sticky top-0 z-30 border-b border-white/60 bg-white/65 backdrop-blur-xl shadow-2xs"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="relative flex items-center py-2">
          {/* Left Lead Pill */}
          <div className="hidden sm:flex shrink-0 items-center gap-1.5 pr-2 mr-1 border-r border-brand/15 text-brand-deep">
            <span className="flex size-6 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Globe className="size-3.5" />
            </span>
            <div className="leading-tight">
              <span className="block text-[11px] font-bold text-brand-deep">
                भाषा / Language
              </span>
              <span className="block text-[9px] font-semibold text-brand-deep/60">
                27 Indian Languages
              </span>
            </div>
          </div>

          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              aria-label="Scroll languages left"
              className="absolute left-0 sm:left-[148px] z-10 hidden sm:flex size-7 items-center justify-center rounded-full border border-white/90 bg-white/95 text-brand-deep shadow-md transition-all hover:bg-white hover:scale-105"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}

          {/* Horizontal Scrollable Language Ribbon */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 sm:px-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {filteredLangs.map((item) => {
              const isActive = lang === item.id;
              return (
                <button
                  key={item.id}
                  data-lang={item.id}
                  type="button"
                  onClick={() => setLang(item.id)}
                  aria-pressed={isActive}
                  className={`group shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 select-none ${
                    isActive
                      ? "bg-brand text-primary-foreground shadow-md shadow-brand/20 ring-2 ring-brand/40 font-semibold scale-102"
                      : "border border-white/80 bg-white/60 text-brand-deep/85 hover:border-brand/30 hover:bg-white/90 hover:text-brand-deep hover:shadow-2xs active:scale-98"
                  }`}
                >
                  <span className="text-xs font-bold tracking-tight">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] tracking-normal font-normal ${
                      isActive ? "text-white/80" : "text-brand-deep/50 group-hover:text-brand-deep/70"
                    }`}
                  >
                    ({item.englishLabel})
                  </span>
                  {isActive && (
                    <Check className="size-3 text-white shrink-0 animate-in zoom-in-50 duration-200" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              aria-label="Scroll languages right"
              className="absolute right-8 sm:right-9 z-10 hidden sm:flex size-7 items-center justify-center rounded-full border border-white/90 bg-white/95 text-brand-deep shadow-md transition-all hover:bg-white hover:scale-105"
            >
              <ChevronRight className="size-4" />
            </button>
          )}

          {/* Quick Search toggle */}
          <div className="shrink-0 pl-1.5">
            {isSearching ? (
              <div className="flex items-center gap-1 rounded-full border border-brand/30 bg-white px-2 py-0.5 shadow-2xs">
                <Search className="size-3 text-brand" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Filter language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setIsSearching(false);
                  }}
                  className="w-24 sm:w-28 text-xs text-ink outline-none bg-transparent placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearching(false);
                  }}
                  className="text-[10px] text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearching(true)}
                title="Search language"
                className="flex size-7 items-center justify-center rounded-full border border-white/80 bg-white/60 text-brand-deep/70 hover:bg-white hover:text-brand transition"
              >
                <Search className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
