import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { MapPin, TrendingUp, Sprout, ArrowRight } from "lucide-react";

export default function HowItWorksMobileView() {
  const { t } = useI18n();

  const steps = [
    {
      n: "1",
      title: t("how1Title"),
      body: t("how1"),
      icon: MapPin,
      badge: "Location Matching",
      accent: "bg-teal-100 text-teal-800 border-teal-200",
    },
    {
      n: "2",
      title: t("how2Title"),
      body: t("how2"),
      icon: TrendingUp,
      badge: "Real-time APMC",
      accent: "bg-amber-100 text-amber-900 border-amber-200",
    },
    {
      n: "3",
      title: t("how3Title"),
      body: t("how3"),
      icon: Sprout,
      badge: "0% Commission",
      accent: "bg-emerald-100 text-emerald-900 border-emerald-200",
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-3.5 pt-3 pb-8">
      {/* Header */}
      <section className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
          <span>💡</span>
          Formula Market Guide
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-deep">
          {t("howTitle")}
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-brand-deep/70">
          How farmers discover benchmark mandi prices and sell harvests direct with zero middleman fees.
        </p>
      </section>

      {/* Vertical Timeline Step Cards */}
      <div className="flex flex-col gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.n}
              className="relative rounded-2xl border border-white/80 bg-white/75 p-4 shadow-xs backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-display text-sm font-bold text-white shadow-xs">
                  {s.n}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.accent}`}>
                      {s.badge}
                    </span>
                    <Icon className="size-4 text-brand-deep/50 shrink-0" />
                  </div>
                  <h2 className="mt-1 font-display text-base font-bold text-brand-deep">
                    {s.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-deep/80 font-medium">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action CTAs */}
      <div className="flex flex-col gap-2.5 pt-2">
        <Link
          to="/rates"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-teal-800 py-3 text-sm font-bold text-white shadow-md active:scale-98 transition"
        >
          <span>Check Today's Live Mandi Rates</span>
          <ArrowRight className="size-4" />
        </Link>
        <Link
          to="/sell"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md active:scale-98 transition"
        >
          <span>{t("sellTitle")}</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
