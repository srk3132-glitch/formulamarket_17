import { useI18n } from "@/lib/i18n";
import { STATES, useRegion } from "@/lib/region-store";
import { findDistrict, findState } from "@/lib/regions";
import { ChevronDown } from "lucide-react";

interface RegionSelectorProps {
  layout?: "vertical" | "grid";
}

export function RegionSelector({ layout = "grid" }: RegionSelectorProps) {
  const { t } = useI18n();
  const { region, setRegion } = useRegion();

  const state = findState(region.stateId);
  const district = findDistrict(region.stateId, region.districtId);

  const containerClass =
    layout === "vertical"
      ? "flex flex-col gap-3 text-sm"
      : "grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-3";

  const selectClass =
    "w-full min-w-0 truncate min-h-[48px] appearance-none rounded-xl border border-brand-deep/20 bg-white/90 px-3.5 py-3 pr-9 text-base sm:text-sm font-semibold text-brand-deep shadow-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition cursor-pointer";

  return (
    <div className={containerClass}>
      {/* State Selection */}
      <label className="block min-w-0">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
          {t("state")}
        </span>
        <div className="relative">
          <select
            className={selectClass}
            value={state.id}
            onChange={(e) => {
              const next = findState(e.target.value);
              const d = next.districts[0]!;
              setRegion({ stateId: next.id, districtId: d.id, placeId: d.places[0]!.id });
            }}
            aria-label={t("state")}
          >
            {STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-brand-deep/60" />
        </div>
      </label>

      {/* District Selection */}
      <label className="block min-w-0">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
          {t("district")}
        </span>
        <div className="relative">
          <select
            className={selectClass}
            value={district.id}
            onChange={(e) => {
              const d = findDistrict(state.id, e.target.value);
              setRegion({ stateId: state.id, districtId: d.id, placeId: d.places[0]!.id });
            }}
            aria-label={t("district")}
          >
            {state.districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-brand-deep/60" />
        </div>
      </label>

      {/* Place / Mandi Selection */}
      <label className="block min-w-0">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-deep/70">
          {t("place")}
        </span>
        <div className="relative">
          <select
            className={selectClass}
            value={region.placeId}
            onChange={(e) =>
              setRegion({ stateId: state.id, districtId: district.id, placeId: e.target.value })
            }
            aria-label={t("place")}
          >
            {district.places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-brand-deep/60" />
        </div>
      </label>
    </div>
  );
}
