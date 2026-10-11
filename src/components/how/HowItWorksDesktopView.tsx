import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { MapPin, TrendingUp, Sprout, ArrowRight } from "lucide-react";

export default function HowItWorksDesktopView() {
  const { t } = useI18n();

  const steps = [
    {
      n: "1",
      title: t("how1Title"),
      body: t("how1"),
      icon: MapPin,
      badge: "Location Matching",
    },
    {
      n: "2",
      title: t("how2Title"),
      body: t("how2"),
      icon: TrendingUp,
      badge: "Real-time APMC",
    },
    {
      n: "3",
      title: t("how3Title"),
      body: t("how3"),
      icon: Sprout,
      badge: "0% Commission",
    },
  ];

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10 animate-fade-in">
      <section className="rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            Platform Guide
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-deep">
            {t("howTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-deep/70">
            How Formula Market enables transparent price discovery and direct farmer-to-buyer transactions across 111 South Indian districts.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="group flex flex-col justify-between rounded-2xl border border-white/70 bg-white/60 p-6 backdrop-blur-xl transition hover:border-brand/40 hover:bg-white/80 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand font-display text-sm font-bold text-primary-foreground shadow-sm">
                      {s.n}
                    </span>
                    <Icon className="size-5 text-brand opacity-80" />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold text-brand-deep">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-deep/70">{s.body}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-brand-deep/5">
                  <span className="text-[11px] font-semibold text-brand">{s.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-4 border-t border-brand-deep/10 pt-6">
          <Link
            to="/sell"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90"
          >
            <span>{t("sellTitle")}</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/rates"
            className="inline-flex items-center gap-2 rounded-xl border border-brand/30 bg-white/70 px-5 py-3 text-sm font-semibold text-brand transition hover:bg-white"
          >
            <span>View Today's Rates</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
