import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
export { getCropImage } from "@/lib/crop-images";

export type Listing = {
  id: string;
  cropId: string;
  quantity: number;
  price: number;
  farmer: string;
  phone: string;
  stateId: string;
  districtId: string;
  placeId: string;
  placeName: string;
  distanceKm: number;
};

const SEED: Listing[] = [
  {
    id: "l1",
    cropId: "tomato",
    quantity: 1,
    price: 2140,
    farmer: "Ravi Farms",
    phone: "+91 98400 11223",
    stateId: "tn",
    districtId: "coimbatore",
    placeId: "kurumbapakkam",
    placeName: "Kurumbapakkam",
    distanceKm: 2,
  },
  {
    id: "l2",
    cropId: "onion",
    quantity: 5,
    price: 1480,
    farmer: "Sulochana Co-op",
    phone: "+91 94430 55110",
    stateId: "tn",
    districtId: "madurai",
    placeId: "usilampatti",
    placeName: "Usilampatti Market Yard",
    distanceKm: 34,
  },
  {
    id: "l3",
    cropId: "chilli",
    quantity: 2,
    price: 14600,
    farmer: "Prakash Gardens",
    phone: "+91 90030 77441",
    stateId: "ap",
    districtId: "guntur",
    placeId: "guntur-market",
    placeName: "Guntur Mirchi Yard (Asia's Largest)",
    distanceKm: 58,
  },
  {
    id: "l4",
    cropId: "turmeric",
    quantity: 12,
    price: 8100,
    farmer: "Anjaneyulu N.",
    phone: "+91 99590 22087",
    stateId: "ts",
    districtId: "nizamabad",
    placeId: "nizamabad-yard",
    placeName: "Nizamabad APMC Turmeric Yard",
    distanceKm: 11,
  },
  {
    id: "l5",
    cropId: "pepper",
    quantity: 1,
    price: 57500,
    farmer: "Maravoor Estate",
    phone: "+91 97440 31298",
    stateId: "kl",
    districtId: "kottayam",
    placeId: "maravoor",
    placeName: "Maravoor Estate Yard",
    distanceKm: 7,
  },
  {
    id: "l6",
    cropId: "rice",
    quantity: 30,
    price: 4290,
    farmer: "Attur Farmer Group",
    phone: "+91 93450 66120",
    stateId: "tn",
    districtId: "salem",
    placeId: "attur",
    placeName: "Attur Sago & Tapioca Mandi",
    distanceKm: 21,
  },
  {
    id: "l7",
    cropId: "banana",
    quantity: 15,
    price: 1820,
    farmer: "Kaveri River Orchards",
    phone: "+91 98421 33445",
    stateId: "tn",
    districtId: "coimbatore",
    placeId: "pollachi",
    placeName: "Pollachi Coconut & Veg Mandi",
    distanceKm: 8,
  },
  {
    id: "l8",
    cropId: "mango",
    quantity: 25,
    price: 4400,
    farmer: "Sri Balaji Mango Grove",
    phone: "+91 99402 77112",
    stateId: "ap",
    districtId: "chittoor",
    placeId: "chittoor-market",
    placeName: "Chittoor Mango & Jaggery Market",
    distanceKm: 42,
  },
  {
    id: "l9",
    cropId: "tomato",
    quantity: 18,
    price: 2180,
    farmer: "Madanapalle Red Gold Producers",
    phone: "+91 99890 55432",
    stateId: "ap",
    districtId: "chittoor",
    placeId: "madanapalle",
    placeName: "Madanapalle Tomato Mandi",
    distanceKm: 15,
  },
  {
    id: "l10",
    cropId: "carrot",
    quantity: 12,
    price: 3050,
    farmer: "Ooty Valley Greens",
    phone: "+91 98403 44556",
    stateId: "tn",
    districtId: "nilgiris",
    placeId: "ooty",
    placeName: "Udhagamandalam (Ooty) Vegetable Yard",
    distanceKm: 14,
  },
  {
    id: "l11",
    cropId: "pomegranate",
    quantity: 8,
    price: 9400,
    farmer: "Deccan Fruit Producers",
    phone: "+91 98850 66778",
    stateId: "ts",
    districtId: "rangareddy",
    placeId: "bowenpally",
    placeName: "Bowenpally Wholesale Veg Mandi",
    distanceKm: 32,
  },
  {
    id: "l12",
    cropId: "pineapple",
    quantity: 20,
    price: 3150,
    farmer: "Vazhakulam Pineapple Growers",
    phone: "+91 94470 88211",
    stateId: "kl",
    districtId: "ernakulam",
    placeId: "muvattupuzha",
    placeName: "Muvattupuzha Vazhakulam Pineapple Market",
    distanceKm: 18,
  },
  {
    id: "l13",
    cropId: "cotton",
    quantity: 35,
    price: 7100,
    farmer: "Enumamula Cotton Rythu Sangham",
    phone: "+91 98490 33412",
    stateId: "ts",
    districtId: "warangal",
    placeId: "enumamula",
    placeName: "Enumamula Market Yard",
    distanceKm: 9,
  },
  {
    id: "l14",
    cropId: "pepper",
    quantity: 4,
    price: 58200,
    farmer: "Wayanad Highland Spice Estate",
    phone: "+91 97451 22904",
    stateId: "kl",
    districtId: "wayanad",
    placeId: "sulthan-bathery",
    placeName: "Sulthan Bathery Coffee & Pepper Yard",
    distanceKm: 25,
  },
];

type ListingsContextValue = {
  listings: Listing[];
  addListing: (l: Omit<Listing, "id" | "distanceKm">) => void;
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [added, setAdded] = useState<Listing[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem("kb-listings");
    if (!raw) return;
    try {
      setAdded(JSON.parse(raw) as Listing[]);
    } catch {
      /* ignore malformed value */
    }
  }, []);

  const addListing = useCallback((l: Omit<Listing, "id" | "distanceKm">) => {
    setAdded((prev) => {
      const next = [
        { ...l, id: `u${Date.now()}`, distanceKm: Math.round(1 + Math.random() * 9) },
        ...prev,
      ];
      window.localStorage.setItem("kb-listings", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<ListingsContextValue>(
    () => ({ listings: [...added, ...SEED], addListing }),
    [added, addListing],
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used inside ListingsProvider");
  return ctx;
}
