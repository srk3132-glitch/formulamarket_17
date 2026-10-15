export function RatesMobileSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Loading live mandi rates">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-brand/10 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 rounded-md bg-brand-deep/15" />
                <div className="h-3 w-16 rounded-md bg-brand-deep/10" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <div className="h-5 w-20 rounded-md bg-brand/20 ml-auto" />
              <div className="h-3 w-12 rounded-md bg-brand-deep/10 ml-auto" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-brand-deep/5 flex items-center justify-between">
            <div className="h-3 w-32 rounded-md bg-brand-deep/10" />
            <div className="h-7 w-24 rounded-lg bg-brand/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RatesDesktopSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse" aria-label="Loading live mandi rates">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-3xl border border-white/70 bg-white/55 p-5 shadow-sm min-h-[220px]"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-16 rounded-full bg-brand-deep/10" />
                <div className="h-5 w-32 rounded-md bg-brand-deep/15" />
                <div className="h-3 w-20 rounded-md bg-brand-deep/10" />
              </div>
              <div className="h-6 w-14 rounded-full bg-brand/15" />
            </div>
            <div className="mt-4 rounded-2xl bg-white/70 p-3.5 space-y-2">
              <div className="h-3 w-28 rounded-md bg-brand-deep/10" />
              <div className="h-7 w-32 rounded-md bg-brand/20" />
              <div className="h-3 w-full rounded-md bg-brand-deep/10" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-deep/5 grid grid-cols-2 gap-2">
            <div className="h-8 rounded-xl bg-emerald-600/10" />
            <div className="h-8 rounded-xl bg-amber-700/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
