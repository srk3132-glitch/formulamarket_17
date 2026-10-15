import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { sendTwilioSms } from "./twilio-service";

export type SlotType = "farmer_mandi" | "buyer_pickup";
export type SlotStatus = "CONFIRMED" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface BookedSlot {
  id: string; // e.g. SLOT-2026-MH-4921
  type: SlotType;
  userName: string;
  phone: string;
  stateId: string;
  districtId: string;
  placeId: string;
  placeName: string;
  cropId: string;
  cropName: string;
  quantity: number; // in quintals
  slotDate: string; // YYYY-MM-DD
  timeWindow: string; // e.g. "Morning (06:00 AM - 10:00 AM)"
  vehicleType: string;
  vehicleNumber: string;
  bayNumber?: string;
  status: SlotStatus;
  createdAt: string;
  smsDelivered?: boolean;
}

const SEED_SLOTS: BookedSlot[] = [
  {
    id: "SLOT-2026-TN-1082",
    type: "farmer_mandi",
    userName: "Ramesh Patel",
    phone: "+91 98230 45671",
    stateId: "tn",
    districtId: "coimbatore",
    placeId: "kurumbapakkam",
    placeName: "Kurumbapakkam Market Yard",
    cropId: "tomato",
    cropName: "Tomato (Hybrid/Desi)",
    quantity: 15,
    slotDate: new Date(Date.now() + 86400000).toISOString().split("T")[0]!,
    timeWindow: "Morning (06:00 AM - 10:00 AM)",
    vehicleType: "Pickup / 407",
    vehicleNumber: "TN-38-BZ-4102",
    bayNumber: "Bay #4 (Weighbridge A)",
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    smsDelivered: true,
  },
  {
    id: "SLOT-2026-MH-3381",
    type: "buyer_pickup",
    userName: "Venkat Raman (Krishna Traders)",
    phone: "+91 98401 77890",
    stateId: "mh",
    districtId: "nashik",
    placeId: "lasalgaon",
    placeName: "Lasalgaon Onion Mandi",
    cropId: "onion",
    cropName: "Onion (Red/Bellary)",
    quantity: 50,
    slotDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]!,
    timeWindow: "Midday (10:00 AM - 02:00 PM)",
    vehicleType: "Heavy Lorry (6-10 Wheeler)",
    vehicleNumber: "MH-15-AK-9811",
    bayNumber: "Loading Dock #2",
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    smsDelivered: true,
  },
];

interface SlotsContextValue {
  slots: BookedSlot[];
  bookSlot: (data: Omit<BookedSlot, "id" | "status" | "createdAt" | "bayNumber">) => Promise<BookedSlot>;
  cancelSlot: (slotId: string) => void;
}

const SlotsContext = createContext<SlotsContextValue | null>(null);

export function SlotsProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<BookedSlot[]>(SEED_SLOTS);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("kb-slots");
      if (saved) {
        const parsed = JSON.parse(saved) as BookedSlot[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlots(parsed);
        }
      }
    } catch {
      // ignore JSON error
    }
  }, []);

  const saveSlots = (updated: BookedSlot[]) => {
    setSlots(updated);
    try {
      window.localStorage.setItem("kb-slots", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const bookSlot = async (
    data: Omit<BookedSlot, "id" | "status" | "createdAt" | "bayNumber">
  ): Promise<BookedSlot> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const statePrefix = (data.stateId || "IN").toUpperCase();
    const slotId = `SLOT-2026-${statePrefix}-${randomSuffix}`;
    const bayNum = `Bay #${Math.floor(1 + Math.random() * 12)} (Gate ${Math.floor(1 + Math.random() * 4)})`;

    const newSlot: BookedSlot = {
      ...data,
      id: slotId,
      status: "CONFIRMED",
      bayNumber: bayNum,
      createdAt: new Date().toISOString(),
      smsDelivered: false,
    };

    // Send Real-time confirmation SMS via Twilio
    try {
      const smsText = `FarmConnect Hub: Booking Confirmed! Token: ${slotId} for ${data.cropName} (${data.quantity} Qtl) on ${data.slotDate} at ${data.placeName}. Vehicle: ${data.vehicleNumber}. Show this SMS at the gate.`;
      const res = await sendTwilioSms({
        data: {
          phoneNumber: data.phone,
          message: smsText,
        },
      });
      if (res.success) {
        newSlot.smsDelivered = true;
      }
    } catch (err) {
      console.warn("Could not dispatch Twilio confirmation SMS:", err);
    }

    const updated = [newSlot, ...slots];
    saveSlots(updated);
    return newSlot;
  };

  const cancelSlot = (slotId: string) => {
    const updated = slots.map((s) => (s.id === slotId ? { ...s, status: "CANCELLED" as SlotStatus } : s));
    saveSlots(updated);
  };

  return (
    <SlotsContext.Provider value={{ slots, bookSlot, cancelSlot }}>
      {children}
    </SlotsContext.Provider>
  );
}

export function useSlots() {
  const ctx = useContext(SlotsContext);
  if (!ctx) throw new Error("useSlots must be used inside SlotsProvider");
  return ctx;
}
