import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "seller" | "buyer";

export type BuyerCategory = "wholesale" | "retail" | "processor" | "consumer";

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string;
  // Seller specific
  farmName?: string;
  stateId?: string;
  districtId?: string;
  placeName?: string;
  primaryCrops?: string[];
  // Buyer specific
  businessName?: string;
  businessType?: BuyerCategory;
  licenseNo?: string;
  deliveryCity?: string;
}

export const DEMO_SELLERS: UserProfile[] = [
  {
    id: "seller_ramesh",
    role: "seller",
    name: "Ramesh Patel",
    phone: "+91 98230 45671",
    farmName: "Patel Krishi Farm",
    stateId: "tn",
    districtId: "coimbatore",
    placeName: "Kurumbapakkam",
    primaryCrops: ["tomato", "onion"],
  },
  {
    id: "seller_murugan",
    role: "seller",
    name: "Murugan K.",
    phone: "+91 94432 89012",
    farmName: "Murugan Organic Fields",
    stateId: "tn",
    districtId: "salem",
    placeName: "Attur Sago & Tapioca Mandi",
    primaryCrops: ["rice", "turmeric"],
  },
  {
    id: "seller_suresh",
    role: "seller",
    name: "Suresh Reddy",
    phone: "+91 99891 23456",
    farmName: "Sri Lakshmi Agri Farm",
    stateId: "ap",
    districtId: "guntur",
    placeName: "Guntur Mirchi Yard",
    primaryCrops: ["chilli", "groundnut"],
  },
  {
    id: "seller_venkat",
    role: "seller",
    name: "Venkat Rao",
    phone: "+91 98490 88123",
    farmName: "Kakatiya Rythu Farm",
    stateId: "ts",
    districtId: "warangal",
    placeName: "Enumamula Market Yard",
    primaryCrops: ["cotton", "maize"],
  },
  {
    id: "seller_george",
    role: "seller",
    name: "George Mathew",
    phone: "+91 94471 90234",
    farmName: "Highland Spice Plantation",
    stateId: "kl",
    districtId: "wayanad",
    placeName: "Sulthan Bathery Coffee & Pepper Yard",
    primaryCrops: ["pepper", "ginger"],
  },
];

export const DEMO_BUYERS: UserProfile[] = [
  {
    id: "buyer_krishna",
    role: "buyer",
    name: "Venkat Raman",
    phone: "+91 98401 77890",
    email: "procurement@krishnatraders.in",
    businessName: "Sri Krishna Wholesale Traders",
    businessType: "wholesale",
    licenseNo: "APMC-CHN-4491",
    deliveryCity: "Chennai Koyambedu Hub",
  },
  {
    id: "buyer_apex",
    role: "buyer",
    name: "Rajesh Varma",
    phone: "+91 98850 12399",
    email: "buy@apexfoods.com",
    businessName: "Apex Food Processing Ltd",
    businessType: "processor",
    licenseNo: "FSSAI-2024-9812",
    deliveryCity: "Hyderabad Bowenpally Terminal",
  },
  {
    id: "buyer_freshmart",
    role: "buyer",
    name: "Ananya Menon",
    phone: "+91 94471 66543",
    email: "vendor@freshharvest.co",
    businessName: "FreshHarvest Retail Chain",
    businessType: "retail",
    licenseNo: "REG-KL-7721",
    deliveryCity: "Kochi & Bangalore Superstores",
  },
  {
    id: "buyer_srinivas",
    role: "buyer",
    name: "Srinivasa Rao",
    phone: "+91 98480 34120",
    email: "trade@andhramandi.com",
    businessName: "Balaji Agro Commodity Traders",
    businessType: "wholesale",
    licenseNo: "APMC-AP-1082",
    deliveryCity: "Vijayawada & Guntur Hub",
  },
];

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loginAsSeller: (details: Partial<UserProfile> & { name: string; phone: string }) => void;
  loginAsBuyer: (
    details: Partial<UserProfile> & { name: string; phone: string; businessName?: string },
  ) => void;
  quickLoginDemo: (role: UserRole, index?: number) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "kb-auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed && (parsed.role === "seller" || parsed.role === "buyer")) {
          setUser(parsed);
        }
      }
    } catch {
      // Ignore invalid local storage data
    }
  }, []);

  const saveUser = useCallback((nextUser: UserProfile | null) => {
    setUser(nextUser);
    if (typeof window !== "undefined") {
      if (nextUser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        window.localStorage.setItem("fm-auth-user", JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem("fm-auth-user");
      }
      window.dispatchEvent(new Event("fm:auth-change"));
    }
  }, []);

  const loginAsSeller = useCallback(
    (details: Partial<UserProfile> & { name: string; phone: string }) => {
      const newUser: UserProfile = {
        id: `seller_${Date.now()}`,
        role: "seller",
        name: details.name,
        phone: details.phone,
        farmName: details.farmName || `${details.name}'s Farm`,
        stateId: details.stateId || "tn",
        districtId: details.districtId || "coimbatore",
        placeName: details.placeName || "Kurumbapakkam",
        primaryCrops: details.primaryCrops || ["tomato"],
      };
      saveUser(newUser);
    },
    [saveUser],
  );

  const loginAsBuyer = useCallback(
    (details: Partial<UserProfile> & { name: string; phone: string; businessName?: string }) => {
      const newUser: UserProfile = {
        id: `buyer_${Date.now()}`,
        role: "buyer",
        name: details.name,
        phone: details.phone,
        email: details.email || "",
        businessName: details.businessName || `${details.name} Trading Co.`,
        businessType: details.businessType || "wholesale",
        licenseNo: details.licenseNo || "APMC-REGISTERED",
        deliveryCity: details.deliveryCity || "Regional Hub",
      };
      saveUser(newUser);
    },
    [saveUser],
  );

  const quickLoginDemo = useCallback(
    (role: UserRole, index = 0) => {
      const pool = role === "seller" ? DEMO_SELLERS : DEMO_BUYERS;
      const demo = pool[index % pool.length];
      saveUser(demo ?? null);
    },
    [saveUser],
  );

  const logout = useCallback(() => {
    saveUser(null);
  }, [saveUser]);

  const switchRole = useCallback(
    (newRole: UserRole) => {
      quickLoginDemo(newRole, 0);
    },
    [quickLoginDemo],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      loginAsSeller,
      loginAsBuyer,
      quickLoginDemo,
      logout,
      switchRole,
    }),
    [user, loginAsSeller, loginAsBuyer, quickLoginDemo, logout, switchRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
