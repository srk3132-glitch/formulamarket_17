import { useEffect, useState } from "react";
import { CROPS, type CropCategory } from "./i18n";

export type PriceRow = {
  cropId: string;
  category: CropCategory;
  min: number;
  max: number;
  modal: number;
  changePct: number;
};

const BASE: Record<string, number> = {
  // Vegetables (₹/quintal)
  tomato: 2140,
  onion: 1480,
  potato: 1620,
  chilli: 4800,
  brinjal: 1950,
  okra: 2400,
  cabbage: 1150,
  cauliflower: 2200,
  carrot: 3100,
  garlic: 12500,
  ginger: 7800,
  bottle_gourd: 1350,
  bitter_gourd: 2750,
  capsicum: 3600,
  drumstick: 4200,
  beetroot: 2250,
  cucumber: 1650,

  // Fruits (₹/quintal)
  banana: 1750,
  mango: 4500,
  apple: 8200,
  pomegranate: 9500,
  papaya: 1400,
  orange: 3800,
  grapes: 5400,
  watermelon: 980,
  guava: 2600,
  pineapple: 3200,
  sapota: 2100,
  sweet_lime: 3400,
  lemon: 5200,

  // Grains, Spices & Cash Crops (₹/quintal)
  rice: 4350,
  turmeric: 8200,
  coconut: 3100,
  groundnut: 6400,
  pepper: 58000,
  dry_chilli: 16500,
  cotton: 7200,
  wheat: 2450,
  maize: 2150,
};

function seedFrom(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 100000;
  return h;
}

function pseudo(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function buildPrices(placeId: string, tick: number): PriceRow[] {
  const base = seedFrom(placeId);
  return CROPS.map((crop, i) => {
    const s = base + i * 97;
    const regional = 0.9 + pseudo(s) * 0.25;
    const drift = (pseudo(s + tick * 13) - 0.5) * 0.06;
    const modal = Math.round((BASE[crop.id] ?? 2200) * regional * (1 + drift));
    const spread = 0.14 + pseudo(s + 5) * 0.12;
    return {
      cropId: crop.id,
      category: crop.category,
      modal,
      min: Math.round(modal * (1 - spread)),
      max: Math.round(modal * (1 + spread)),
      changePct: Number(((pseudo(s + tick * 7) - 0.45) * 14).toFixed(1)),
    };
  });
}

/** Simulates a live market feed: values refresh every few seconds. */
export function useLivePrices(placeId: string) {
  const [tick, setTick] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const stamp = () =>
      setUpdatedAt(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    stamp();
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      stamp();
    }, 5000);
    return () => window.clearInterval(id);
  }, [placeId]);

  return { rows: buildPrices(placeId, tick), updatedAt };
}

export function formatRupees(value: number) {
  return "₹" + value.toLocaleString("en-IN");
}

export function formatRupeesPerKg(valuePerQuintal: number) {
  const perKg = (valuePerQuintal / 100).toFixed(1);
  return `₹${perKg}`;
}
