/**
 * Crop Images Registry
 * Maps every crop ID to either a real imported image OR a color+emoji fallback.
 * All 30 vegetables/fruits/grains are covered.
 */

// --- Real photo imports (AI-generated, locally stored) ---
import tomatoImg from "@/assets/tomato.jpg";
import onionImg from "@/assets/onion.jpg";
import chilliImg from "@/assets/chilli.jpg";
import potatoImg from "@/assets/potato.jpg";
import brinjalImg from "@/assets/brinjal.jpg";
import okraImg from "@/assets/okra.jpg";

export interface CropImageData {
  /** Imported image URL (from bundler) – use if defined */
  src?: string;
  /** Emoji to display when no real image */
  emoji: string;
  /** Tailwind-compatible background gradient CSS value */
  gradient: string;
  /** ARIA label / alt text */
  alt: string;
}

export const CROP_IMAGE_MAP: Record<string, CropImageData> = {
  // ─── Vegetables ─────────────────────────────────────────────
  tomato: {
    src: tomatoImg,
    emoji: "🍅",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #ff3d00 100%)",
    alt: "Tomato",
  },
  onion: {
    src: onionImg,
    emoji: "🧅",
    gradient: "linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)",
    alt: "Onion",
  },
  potato: {
    src: potatoImg,
    emoji: "🥔",
    gradient: "linear-gradient(135deg, #d97706 0%, #92400e 100%)",
    alt: "Potato",
  },
  chilli: {
    src: chilliImg,
    emoji: "🌶️",
    gradient: "linear-gradient(135deg, #16a34a 0%, #065f46 100%)",
    alt: "Green Chilli",
  },
  brinjal: {
    src: brinjalImg,
    emoji: "🍆",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
    alt: "Brinjal / Eggplant",
  },
  okra: {
    src: okraImg,
    emoji: "🫛",
    gradient: "linear-gradient(135deg, #15803d 0%, #14532d 100%)",
    alt: "Okra / Ladies Finger",
  },
  cabbage: {
    emoji: "🥬",
    gradient: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
    alt: "Cabbage",
  },
  cauliflower: {
    emoji: "🥦",
    gradient: "linear-gradient(135deg, #f9fafb 0%, #d1fae5 100%)",
    alt: "Cauliflower",
  },
  carrot: {
    emoji: "🥕",
    gradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
    alt: "Carrot",
  },
  garlic: {
    emoji: "🧄",
    gradient: "linear-gradient(135deg, #fef9c3 0%, #ca8a04 100%)",
    alt: "Garlic",
  },
  ginger: {
    emoji: "🫚",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #b45309 100%)",
    alt: "Ginger",
  },
  bottle_gourd: {
    emoji: "🫙",
    gradient: "linear-gradient(135deg, #86efac 0%, #166534 100%)",
    alt: "Bottle Gourd",
  },
  bitter_gourd: {
    emoji: "🌿",
    gradient: "linear-gradient(135deg, #6ee7b7 0%, #065f46 100%)",
    alt: "Bitter Gourd",
  },
  capsicum: {
    emoji: "🫑",
    gradient: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
    alt: "Capsicum / Bell Pepper",
  },
  drumstick: {
    emoji: "🌱",
    gradient: "linear-gradient(135deg, #a3e635 0%, #4d7c0f 100%)",
    alt: "Drumstick / Moringa",
  },
  beetroot: {
    emoji: "🫐",
    gradient: "linear-gradient(135deg, #e879f9 0%, #86198f 100%)",
    alt: "Beetroot",
  },
  cucumber: {
    emoji: "🥒",
    gradient: "linear-gradient(135deg, #4ade80 0%, #065f46 100%)",
    alt: "Cucumber",
  },

  // ─── Fruits ──────────────────────────────────────────────────
  banana: {
    emoji: "🍌",
    gradient: "linear-gradient(135deg, #fde047 0%, #ca8a04 100%)",
    alt: "Banana",
  },
  mango: {
    emoji: "🥭",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    alt: "Mango",
  },
  apple: {
    emoji: "🍎",
    gradient: "linear-gradient(135deg, #f87171 0%, #b91c1c 100%)",
    alt: "Apple",
  },
  pomegranate: {
    emoji: "🍑",
    gradient: "linear-gradient(135deg, #fb7185 0%, #be123c 100%)",
    alt: "Pomegranate",
  },
  papaya: {
    emoji: "🧡",
    gradient: "linear-gradient(135deg, #fb923c 0%, #c2410c 100%)",
    alt: "Papaya",
  },
  orange: {
    emoji: "🍊",
    gradient: "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
    alt: "Orange",
  },
  grapes: {
    emoji: "🍇",
    gradient: "linear-gradient(135deg, #a78bfa 0%, #5b21b6 100%)",
    alt: "Grapes",
  },
  watermelon: {
    emoji: "🍉",
    gradient: "linear-gradient(135deg, #4ade80 0%, #dc2626 100%)",
    alt: "Watermelon",
  },
  guava: {
    emoji: "🍐",
    gradient: "linear-gradient(135deg, #bef264 0%, #65a30d 100%)",
    alt: "Guava",
  },
  pineapple: {
    emoji: "🍍",
    gradient: "linear-gradient(135deg, #fde047 0%, #f59e0b 100%)",
    alt: "Pineapple",
  },
  sapota: {
    emoji: "🟤",
    gradient: "linear-gradient(135deg, #d97706 0%, #78350f 100%)",
    alt: "Sapota / Chiku",
  },
  sweet_lime: {
    emoji: "🍋",
    gradient: "linear-gradient(135deg, #d9f99d 0%, #65a30d 100%)",
    alt: "Sweet Lime / Mosambi",
  },
  lemon: {
    emoji: "🍋",
    gradient: "linear-gradient(135deg, #fef08a 0%, #ca8a04 100%)",
    alt: "Lemon",
  },

  // ─── Grains, Spices & Cash Crops ─────────────────────────────
  rice: {
    emoji: "🌾",
    gradient: "linear-gradient(135deg, #fef9c3 0%, #ca8a04 100%)",
    alt: "Rice",
  },
  turmeric: {
    emoji: "🟡",
    gradient: "linear-gradient(135deg, #fde047 0%, #b45309 100%)",
    alt: "Turmeric",
  },
  coconut: {
    emoji: "🥥",
    gradient: "linear-gradient(135deg, #d6d3d1 0%, #78716c 100%)",
    alt: "Coconut",
  },
  groundnut: {
    emoji: "🥜",
    gradient: "linear-gradient(135deg, #d97706 0%, #7c2d12 100%)",
    alt: "Groundnut",
  },
  pepper: {
    emoji: "⚫",
    gradient: "linear-gradient(135deg, #374151 0%, #111827 100%)",
    alt: "Black Pepper",
  },
  dry_chilli: {
    emoji: "🌶️",
    gradient: "linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)",
    alt: "Dry Red Chilli",
  },
  cotton: {
    emoji: "🤍",
    gradient: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
    alt: "Cotton",
  },
  wheat: {
    emoji: "🌾",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #92400e 100%)",
    alt: "Wheat",
  },
  maize: {
    emoji: "🌽",
    gradient: "linear-gradient(135deg, #fde047 0%, #d97706 100%)",
    alt: "Maize / Corn",
  },
};

/** Returns the best image data for a given crop ID */
export function getCropImage(cropId: string): CropImageData {
  return (
    CROP_IMAGE_MAP[cropId] ?? {
      emoji: "🌿",
      gradient: "linear-gradient(135deg, #6ee7b7 0%, #065f46 100%)",
      alt: cropId,
    }
  );
}
