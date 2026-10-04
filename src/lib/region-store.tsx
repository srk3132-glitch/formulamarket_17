import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STATES, findDistrict, findPlace, findState } from "./regions";

export type Region = { stateId: string; districtId: string; placeId: string };

const DEFAULT_REGION: Region = {
  stateId: "tn",
  districtId: "coimbatore",
  placeId: "kurumbapakkam",
};

type RegionContextValue = {
  region: Region;
  setRegion: (r: Region) => void;
  stateName: string;
  districtName: string;
  placeName: string;
};

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>(DEFAULT_REGION);

  useEffect(() => {
    const raw = window.localStorage.getItem("kb-region");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Region;
      if (parsed.stateId && parsed.districtId && parsed.placeId) setRegionState(parsed);
    } catch {
      /* ignore malformed value */
    }
  }, []);

  const value = useMemo<RegionContextValue>(() => {
    const state = findState(region.stateId);
    const district = findDistrict(region.stateId, region.districtId);
    const place = findPlace(region.stateId, region.districtId, region.placeId);
    return {
      region: { stateId: state.id, districtId: district.id, placeId: place.id },
      setRegion: (r: Region) => {
        setRegionState(r);
        window.localStorage.setItem("kb-region", JSON.stringify(r));
      },
      stateName: state.name,
      districtName: district.name,
      placeName: place.name,
    };
  }, [region]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used inside RegionProvider");
  return ctx;
}

export { STATES };
