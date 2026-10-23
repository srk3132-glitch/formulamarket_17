/**
 * Crop Images Registry
 * Maps every single crop ID to its real, high-resolution realistic photo.
 * Covers all 39 agricultural commodities (vegetables, fruits, grains & cash crops).
 */

// ─── Real Local Photos ───────────────────────────────────────────
import tomatoImg from "@/assets/tomato.jpg";
import onionImg from "@/assets/onion.jpg";
import chilliImg from "@/assets/chilli.jpg";
import potatoImg from "@/assets/potato.jpg";
import brinjalImg from "@/assets/brinjal.jpg";
import okraImg from "@/assets/okra.jpg";
import cabbageImg from "@/assets/cabbage.jpg";
import cauliflowerImg from "@/assets/cauliflower.jpg";
import carrotImg from "@/assets/carrot.jpg";
import garlicImg from "@/assets/garlic.jpg";
import gingerImg from "@/assets/ginger.jpg";
import bottleGourdImg from "@/assets/bottle_gourd.jpg";
import bitterGourdImg from "@/assets/bitter_gourd.jpg";
import capsicumImg from "@/assets/capsicum.jpg";
import drumstickImg from "@/assets/drumstick.jpg";
import beetrootImg from "@/assets/beetroot.jpg";
import cucumberImg from "@/assets/cucumber.jpg";
import bananaImg from "@/assets/banana.jpg";
import mangoImg from "@/assets/mango.jpg";
import appleImg from "@/assets/apple.jpg";
import pomegranateImg from "@/assets/pomegranate.jpg";
import papayaImg from "@/assets/papaya.jpg";
import orangeImg from "@/assets/orange.jpg";
import grapesImg from "@/assets/grapes.jpg";
import watermelonImg from "@/assets/watermelon.jpg";
import guavaImg from "@/assets/guava.jpg";
import pineappleImg from "@/assets/pineapple.jpg";
import sapotaImg from "@/assets/sapota.jpg";
import sweetLimeImg from "@/assets/sweet_lime.jpg";
import lemonImg from "@/assets/lemon.jpg";
import riceImg from "@/assets/rice.jpg";
import turmericImg from "@/assets/turmeric.jpg";
import coconutImg from "@/assets/coconut.jpg";
import groundnutImg from "@/assets/groundnut.jpg";
import pepperImg from "@/assets/pepper.jpg";
import dryChilliImg from "@/assets/dry_chilli.jpg";
import cottonImg from "@/assets/cotton.jpg";
import wheatImg from "@/assets/wheat.jpg";
import maizeImg from "@/assets/maize.jpg";

export interface CropImageData {
  /** Real photo URL from bundler */
  src: string;
  /** High-fidelity emoji fallback */
  emoji: string;
  /** Tailwind-compatible background gradient CSS value */
  gradient: string;
  /** Accessible alt label */
  alt: string;
}

export const CROP_IMAGE_MAP: Record<string, CropImageData> = {
  // ─── Vegetables (17) ──────────────────────────────────────────
  tomato: {
    src: tomatoImg,
    emoji: "🍅",
    gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    alt: "Fresh Red Tomato",
  },
  onion: {
    src: onionImg,
    emoji: "🧅",
    gradient: "linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)",
    alt: "Red Onion",
  },
  potato: {
    src: potatoImg,
    emoji: "🥔",
    gradient: "linear-gradient(135deg, #d97706 0%, #92400e 100%)",
    alt: "Fresh Potato",
  },
  chilli: {
    src: chilliImg,
    emoji: "🌶️",
    gradient: "linear-gradient(135deg, #16a34a 0%, #065f46 100%)",
    alt: "Fresh Green Chilli",
  },
  brinjal: {
    src: brinjalImg,
    emoji: "🍆",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
    alt: "Purple Brinjal / Eggplant",
  },
  okra: {
    src: okraImg,
    emoji: "🫛",
    gradient: "linear-gradient(135deg, #15803d 0%, #14532d 100%)",
    alt: "Fresh Okra / Ladies Finger",
  },
  cabbage: {
    src: cabbageImg,
    emoji: "🥬",
    gradient: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
    alt: "Green Cabbage",
  },
  cauliflower: {
    src: cauliflowerImg,
    emoji: "🥦",
    gradient: "linear-gradient(135deg, #f9fafb 0%, #d1fae5 100%)",
    alt: "White Cauliflower",
  },
  carrot: {
    src: carrotImg,
    emoji: "🥕",
    gradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
    alt: "Fresh Orange Carrot",
  },
  garlic: {
    src: garlicImg,
    emoji: "🧄",
    gradient: "linear-gradient(135deg, #fef9c3 0%, #ca8a04 100%)",
    alt: "Garlic Bulbs",
  },
  ginger: {
    src: gingerImg,
    emoji: "🫚",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #b45309 100%)",
    alt: "Fresh Ginger Root",
  },
  bottle_gourd: {
    src: bottleGourdImg,
    emoji: "🫙",
    gradient: "linear-gradient(135deg, #86efac 0%, #166534 100%)",
    alt: "Green Bottle Gourd / Lauki",
  },
  bitter_gourd: {
    src: bitterGourdImg,
    emoji: "🌿",
    gradient: "linear-gradient(135deg, #6ee7b7 0%, #065f46 100%)",
    alt: "Bitter Gourd / Karela",
  },
  capsicum: {
    src: capsicumImg,
    emoji: "🫑",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    alt: "Green Bell Pepper / Capsicum",
  },
  drumstick: {
    src: drumstickImg,
    emoji: "🥢",
    gradient: "linear-gradient(135deg, #84cc16 0%, #3f6212 100%)",
    alt: "Fresh Drumstick / Moringa",
  },
  beetroot: {
    src: beetrootImg,
    emoji: "🍠",
    gradient: "linear-gradient(135deg, #991b1b 0%, #581c87 100%)",
    alt: "Deep Red Beetroot",
  },
  cucumber: {
    src: cucumberImg,
    emoji: "🥒",
    gradient: "linear-gradient(135deg, #4ade80 0%, #15803d 100%)",
    alt: "Crisp Green Cucumber",
  },

  // ─── Fruits (13) ──────────────────────────────────────────────
  banana: {
    src: bananaImg,
    emoji: "🍌",
    gradient: "linear-gradient(135deg, #fde047 0%, #ca8a04 100%)",
    alt: "Ripe Bananas",
  },
  mango: {
    src: mangoImg,
    emoji: "🥭",
    gradient: "linear-gradient(135deg, #facc15 0%, #ea580c 100%)",
    alt: "Ripe Golden Mango",
  },
  apple: {
    src: appleImg,
    emoji: "🍎",
    gradient: "linear-gradient(135deg, #f87171 0%, #b91c1c 100%)",
    alt: "Fresh Red Apple",
  },
  pomegranate: {
    src: pomegranateImg,
    emoji: "🫐",
    gradient: "linear-gradient(135deg, #dc2626 0%, #831843 100%)",
    alt: "Ruby Pomegranate",
  },
  papaya: {
    src: papayaImg,
    emoji: "🍈",
    gradient: "linear-gradient(135deg, #fb923c 0%, #c2410c 100%)",
    alt: "Sweet Papaya",
  },
  orange: {
    src: orangeImg,
    emoji: "🍊",
    gradient: "linear-gradient(135deg, #fb923c 0%, #d97706 100%)",
    alt: "Juicy Orange",
  },
  grapes: {
    src: grapesImg,
    emoji: "🍇",
    gradient: "linear-gradient(135deg, #a855f7 0%, #581c87 100%)",
    alt: "Fresh Grapes",
  },
  watermelon: {
    src: watermelonImg,
    emoji: "🍉",
    gradient: "linear-gradient(135deg, #ef4444 0%, #15803d 100%)",
    alt: "Juicy Red Watermelon",
  },
  guava: {
    src: guavaImg,
    emoji: "🍐",
    gradient: "linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)",
    alt: "Fresh Green Guava",
  },
  pineapple: {
    src: pineappleImg,
    emoji: "🍍",
    gradient: "linear-gradient(135deg, #eab308 0%, #854d0e 100%)",
    alt: "Fresh Pineapple",
  },
  sapota: {
    src: sapotaImg,
    emoji: "🥔",
    gradient: "linear-gradient(135deg, #b45309 0%, #78350f 100%)",
    alt: "Sapota / Chiku Fruit",
  },
  sweet_lime: {
    src: sweetLimeImg,
    emoji: "🍋",
    gradient: "linear-gradient(135deg, #bef264 0%, #65a30d 100%)",
    alt: "Sweet Lime / Mosambi",
  },
  lemon: {
    src: lemonImg,
    emoji: "🍋",
    gradient: "linear-gradient(135deg, #facc15 0%, #ca8a04 100%)",
    alt: "Yellow Lemon",
  },

  // ─── Grains, Spices & Cash Crops (9) ───────────────────────────
  rice: {
    src: riceImg,
    emoji: "🌾",
    gradient: "linear-gradient(135deg, #fef08a 0%, #ca8a04 100%)",
    alt: "Golden Paddy Rice",
  },
  turmeric: {
    src: turmericImg,
    emoji: "🫚",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    alt: "Raw Golden Turmeric",
  },
  coconut: {
    src: coconutImg,
    emoji: "🥥",
    gradient: "linear-gradient(135deg, #78350f 0%, #451a03 100%)",
    alt: "Fresh Coconut",
  },
  groundnut: {
    src: groundnutImg,
    emoji: "🥜",
    gradient: "linear-gradient(135deg, #d97706 0%, #78350f 100%)",
    alt: "Groundnut / Peanuts Pod",
  },
  pepper: {
    src: pepperImg,
    emoji: "🧂",
    gradient: "linear-gradient(135deg, #1e293b 0%, #020617 100%)",
    alt: "Black Peppercorns",
  },
  dry_chilli: {
    src: dryChilliImg,
    emoji: "🌶️",
    gradient: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
    alt: "Dried Red Chilli Pods",
  },
  cotton: {
    src: cottonImg,
    emoji: "☁️",
    gradient: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
    alt: "White Cotton Bolls",
  },
  wheat: {
    src: wheatImg,
    emoji: "🌾",
    gradient: "linear-gradient(135deg, #fde047 0%, #b45309 100%)",
    alt: "Golden Wheat Grains",
  },
  maize: {
    src: maizeImg,
    emoji: "🌽",
    gradient: "linear-gradient(135deg, #facc15 0%, #d97706 100%)",
    alt: "Fresh Golden Sweet Corn / Maize",
  },
};

/**
 * Fallback defaults
 */
const DEFAULT_IMAGE: CropImageData = {
  src: tomatoImg,
  emoji: "🌾",
  gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  alt: "Farm Produce",
};

/**
 * Returns high-resolution realistic image data for any crop ID.
 */
export function getCropImage(cropId: string): CropImageData {
  const normalized = cropId.toLowerCase().trim().replace(/[-\s]/g, "_");
  return CROP_IMAGE_MAP[normalized] || DEFAULT_IMAGE;
}
