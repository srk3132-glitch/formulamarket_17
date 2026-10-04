import { useI18n } from "@/lib/i18n";
import { STATES, useRegion } from "@/lib/region-store";
import { findDistrict, findState } from "@/lib/regions";

const selectClass =
  "w-full appearance-none rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-brand/50";

export function RegionSelector() {
  const { t } = useI18n();
  const { region, setRegion } = useRegion();

  const state = findState(region.stateId);
  const district = findDistrict(region.stateId, region.districtId);

  return (
    <div className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-3">
      <label className="block">
        <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">{t("state")}</span>
        <select
          className={selectClass}
          value={state.id}
          onChange={(e) => {
            const next = findState(e.target.value);
            const d = next.districts[0]!;
            setRegion({ stateId: next.id, districtId: d.id, placeId: d.places[0]!.id });
          }}
        >
          {STATES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">
          {t("district")}
        </span>
        <select
          className={selectClass}
          value={district.id}
          onChange={(e) => {
            const d = findDistrict(state.id, e.target.value);
            setRegion({ stateId: state.id, districtId: d.id, placeId: d.places[0]!.id });
          }}
        >
          {state.districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-[11px] font-medium text-brand-deep/60">{t("place")}</span>
        <select
          className={selectClass}
          value={region.placeId}
          onChange={(e) =>
            setRegion({ stateId: state.id, districtId: district.id, placeId: e.target.value })
          }
        >
          {district.places.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
