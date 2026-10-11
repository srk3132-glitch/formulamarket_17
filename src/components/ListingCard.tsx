import { cropName, useI18n } from "@/lib/i18n";
import { formatRupees } from "@/lib/prices";
import { getCropImage, type Listing } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";
import { Link } from "@tanstack/react-router";
import { Phone, Lock, Sparkles, MapPin } from "lucide-react";
import paddyImg from "@/assets/paddy-dawn.jpg";

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const image = getCropImage(listing.cropId).src ?? paddyImg;

  const unitLabel = listing.unit || t("quintal");
  const hasPhone = Boolean(listing.phone && listing.phone.trim().length > 3);

  return (
    <article
      className={`group overflow-hidden rounded-3xl border ${
        listing.isRealtimeNew
          ? "border-emerald-500/80 shadow-emerald-500/10 ring-2 ring-emerald-500/30"
          : "border-white/70"
      } bg-white/50 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:bg-white/80 hover:shadow-xl`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {listing.isRealtimeNew ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-emerald-600/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-white"></span>
            </span>
            LIVE NEW
          </span>
        ) : null}
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
            {cropName(listing.cropId, lang)} · {listing.quantity} {unitLabel}
          </p>
          <span className="rounded-lg bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand shadow-sm">
            {formatRupees(listing.price)}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-brand-deep/60">
          <MapPin className="size-3 text-brand/70 shrink-0" />
          <span className="truncate">
            {listing.farmer} · {listing.placeName}
          </span>
        </p>

        {isAuthenticated && hasPhone ? (
          <a
            href={`tel:${listing.phone.replace(/\s/g, "")}`}
            className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl border border-brand/30 bg-brand px-3 py-2 text-center text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand/90 hover:shadow-md active:scale-98"
          >
            <Phone className="size-3.5" />
            <span>Call Farmer ({listing.phone})</span>
          </a>
        ) : (
          <Link
            to="/login"
            search={{ role: "buyer", redirect: "/buy" }}
            className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl border border-amber-600/30 bg-amber-50/80 px-3 py-2 text-center text-xs font-semibold text-amber-900 transition-all duration-200 hover:bg-amber-100 hover:shadow-2xs active:scale-98"
          >
            <Lock className="size-3.5 text-amber-700" />
            <span>Sign in to view farmer contact</span>
          </Link>
        )}
      </div>
    </article>
  );
}
