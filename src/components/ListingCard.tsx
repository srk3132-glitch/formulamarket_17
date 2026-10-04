import { cropName, useI18n } from "@/lib/i18n";
import { formatRupees } from "@/lib/prices";
import { getCropImage, type Listing } from "@/lib/listings-store";
import paddyImg from "@/assets/paddy-dawn.jpg";

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, lang } = useI18n();
  const image = getCropImage(listing.cropId).src ?? paddyImg;

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/70 bg-white/50 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:bg-white/80 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={image}
          alt={`${cropName(listing.cropId, lang)} for sale`}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-brand-deep transition-colors group-hover:text-brand">
            {cropName(listing.cropId, lang)} · {listing.quantity}{" "}
            {listing.quantity === 1 ? t("quintal") : t("quintals")}
          </p>
          <span className="rounded-lg bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand shadow-sm">
            {formatRupees(listing.price)}
          </span>
        </div>
        <p className="mt-1 text-xs text-brand-deep/60">
          {listing.farmer} · {listing.placeName} · {listing.distanceKm} km {t("away")}
        </p>
        <a
          href={`tel:${listing.phone.replace(/\s/g, "")}`}
          className="mt-3 block w-full rounded-xl border border-brand/30 bg-brand/10 px-3 py-2 text-center text-sm font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white hover:shadow-md active:scale-98"
        >
          {t("reserve")}
        </a>
      </div>
    </article>
  );
}
