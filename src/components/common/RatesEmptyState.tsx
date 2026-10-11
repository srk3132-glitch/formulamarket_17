import { SearchX, RotateCcw } from "lucide-react";

interface RatesEmptyStateProps {
  query?: string;
  onReset: () => void;
}

export function RatesEmptyState({ query, onReset }: RatesEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-brand/30 bg-white/50 p-8 text-center backdrop-blur-xl">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
        <SearchX className="size-6" />
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-brand-deep">
        No commodities found
      </h3>
      <p className="mt-1 text-xs text-brand-deep/70 max-w-sm mx-auto">
        {query
          ? `We couldn't find any crop matching "${query}". Try searching for Tomato, Paddy, Onion, or change category.`
          : "No crops match the current filters in this mandi. Try selecting 'All' or a nearby district."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand/90 active:scale-95"
      >
        <RotateCcw className="size-3.5" />
        <span>Reset Filters & Search</span>
      </button>
    </div>
  );
}
