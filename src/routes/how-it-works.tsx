import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Formula Market Works — Price Discovery for Farmers" },
      {
        name: "description",
        content:
          "Pick your state, district and mandi, read today's live crop rates, then list your harvest and sell direct to buyers in your own language.",
      },
      { property: "og:title", content: "How Formula Market Works" },
      {
        property: "og:description",
        content: "Three steps: choose your region, read today's rate, list and sell direct.",
      },
    ],
  }),
  component: HowPage,
});

function HowPage() {
  const { t } = useI18n();

  const steps = [
    { n: "1", title: t("how1Title"), body: t("how1") },
    { n: "2", title: t("how2Title"), body: t("how2") },
    { n: "3", title: t("how3Title"), body: t("how3") },
  ];

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10">
      <section className="rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-deep">
          {t("howTitle")}
        </h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-white/70 bg-white/60 p-5 backdrop-blur-xl"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-brand font-display text-sm font-semibold text-primary-foreground">
                {s.n}
              </span>
              <h2 className="mt-3 font-semibold text-brand-deep">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-deep/70">{s.body}</p>
            </div>
          ))}
        </div>
        <Link
          to="/sell"
          className="mt-6 inline-block rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-brand/90"
        >
          {t("sellTitle")}
        </Link>
      </section>
    </main>
  );
}
