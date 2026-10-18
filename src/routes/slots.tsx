import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSlots, type BookedSlot } from "@/lib/slots-store";
import { useRegion } from "@/lib/region-store";
import { useAuth } from "@/lib/auth-store";
import { CROPS, cropName, useI18n } from "@/lib/i18n";
import { RegionSelector } from "@/components/RegionSelector";
import { InterfaceModeNav } from "@/components/InterfaceModeNav";
import { buildPrices, formatRupees } from "@/lib/prices";
import {
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Printer,
  XCircle,
  Sparkles,
  Phone,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/slots")({
  head: () => ({
    meta: [
      { title: "Mandi & Harvest Slot Booking — Formula Market" },
      {
        name: "description",
        content:
          "Book verified APMC Mandi weighbridge unloading gate passes for farmers and farm produce pickup slots for commercial buyers with instant Twilio SMS confirmation.",
      },
    ],
  }),
  component: SlotBookingPage,
});

const inputClass =
  "w-full rounded-xl border border-white/80 bg-white/70 px-3.5 py-2.5 text-sm font-medium text-ink outline-none placeholder:text-brand-deep/40 focus:border-brand/60 focus:bg-white transition";

const TIME_WINDOWS = [
  { id: "morning", label: "Morning (06:00 AM - 10:00 AM)", bays: "6 bays open", tag: "Fast Track" },
  { id: "midday", label: "Midday (10:00 AM - 02:00 PM)", bays: "3 bays open", tag: "Moderate" },
  { id: "afternoon", label: "Afternoon (02:00 PM - 06:00 PM)", bays: "9 bays open", tag: "Best for Bulk" },
];

const VEHICLE_TYPES = [
  "Tractor Trolley",
  "Pickup (Mahindra Bolero / 407)",
  "Mini Truck (Tata Ace / Chhota Hathi)",
  "Heavy Lorry (6-10 Wheeler)",
  "Auto Cargo / 3-Wheeler",
];

function SlotBookingPage() {
  const { t, lang } = useI18n();
  const { region, placeName, stateName, districtName } = useRegion();
  const { user } = useAuth();
  const { slots, bookSlot, cancelSlot } = useSlots();

  const [activeTab, setActiveTab] = useState<"farmer_mandi" | "buyer_pickup" | "my_passes">("farmer_mandi");

  // Booking Form State
  const [selectedCrop, setSelectedCrop] = useState("tomato");
  const [quantity, setQuantity] = useState("15");
  const [slotDate, setSlotDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]!
  );
  const [timeWindow, setTimeWindow] = useState(TIME_WINDOWS[0]!.label);
  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES[0]!);
  const [vehicleNumber, setVehicleNumber] = useState("MH-15-AB-4819");
  const [userName, setUserName] = useState(user?.name || "Ramesh Patel");
  const [phone, setPhone] = useState(user?.phone || "+91 98230 45671");
  const [bookingSuccess, setBookingSuccess] = useState<BookedSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Price benchmark for current mandi
  const mandiRates = buildPrices(region.placeId, 0);
  const benchmark = mandiRates.find((r) => r.cropId === selectedCrop);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !phone.trim() || !vehicleNumber.trim()) return;

    setIsSubmitting(true);
    try {
      const cropObj = CROPS.find((c) => c.id === selectedCrop);
      const booked = await bookSlot({
        type: activeTab === "farmer_mandi" ? "farmer_mandi" : "buyer_pickup",
        userName: userName.trim(),
        phone: phone.trim(),
        stateId: region.stateId,
        districtId: region.districtId,
        placeId: region.placeId,
        placeName: placeName,
        cropId: selectedCrop,
        cropName: cropObj ? cropName(cropObj.id, lang) : selectedCrop,
        quantity: Number(quantity) || 10,
        slotDate,
        timeWindow,
        vehicleType,
        vehicleNumber: vehicleNumber.toUpperCase().trim(),
      });

      setBookingSuccess(booked);
      setActiveTab("my_passes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-3.5 sm:px-5 pb-16 pt-4 sm:pt-8">
      {/* Mode navigation */}
      <InterfaceModeNav currentMode="slots" />

      {/* Hero Header */}
      <section className="mb-6 rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[var(--shadow-glass)] backdrop-blur-2xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-700/20 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <Calendar className="size-3.5 text-teal-700" />
              Verified APMC Weighbridge & Gate Pass System
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-deep sm:text-4xl">
              Mandi Slot Booking & Digital Gate Passes
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-deep/75">
              Avoid mandi congestion and long weighbridge queues. Book your unloading slot in advance,
              receive verified gate tokens, and get real-time SMS updates delivered via Twilio.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 rounded-2xl border border-white/80 bg-white/60 p-1.5 sm:p-2 shadow-sm w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("farmer_mandi")}
              className={`flex-1 sm:flex-initial text-center whitespace-nowrap min-h-[40px] rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition ${
                activeTab === "farmer_mandi"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-brand-deep/70 hover:bg-white/80"
              }`}
            >
              Farmer Mandi Pass
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("buyer_pickup")}
              className={`flex-1 sm:flex-initial text-center whitespace-nowrap min-h-[40px] rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition ${
                activeTab === "buyer_pickup"
                  ? "bg-amber-800 text-white shadow-sm"
                  : "text-brand-deep/70 hover:bg-white/80"
              }`}
            >
              Buyer Lot Pickup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("my_passes")}
              className={`flex-1 sm:flex-initial text-center whitespace-nowrap min-h-[40px] relative rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition ${
                activeTab === "my_passes"
                  ? "bg-brand text-white shadow-sm"
                  : "text-brand-deep/70 hover:bg-white/80"
              }`}
            >
              My Passes ({slots.length})
            </button>
          </div>
        </div>

        {/* Region banner */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/55 p-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-medium text-brand-deep">
            <Building2 className="size-4 text-teal-700" />
            <span>Target Mandi:</span>
            <span className="font-bold">{placeName}</span>
            <span className="text-brand-deep/50">({districtName}, {stateName})</span>
          </div>
          <span className="text-[11px] font-semibold text-teal-800 bg-teal-100/70 px-2.5 py-1 rounded-lg">
            ⚡ 24 Weighbridges Synchronized
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      {activeTab === "my_passes" ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-brand-deep">
              Active Digital Passes & Gate Tokens
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab("farmer_mandi")}
              className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 transition"
            >
              + Book New Slot
            </button>
          </div>

          {slots.length === 0 ? (
            <div className="rounded-3xl border border-white/60 bg-white/40 p-12 text-center shadow-[var(--shadow-glass)]">
              <Calendar className="mx-auto size-12 text-brand-deep/30" />
              <p className="mt-3 font-semibold text-brand-deep">No slots booked yet</p>
              <p className="text-xs text-brand-deep/60 mt-1">
                Book a weighbridge or produce pickup slot to receive a digital pass and SMS.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {slots.map((s) => (
                <article
                  key={s.id}
                  className="relative overflow-hidden rounded-3xl border-2 border-teal-700/20 bg-white/80 p-6 shadow-lg backdrop-blur-2xl transition hover:shadow-xl"
                >
                  <div className="flex items-start justify-between border-b border-brand-deep/10 pb-4">
                    <div>
                      <span className="inline-block rounded-lg bg-teal-700 px-2.5 py-0.5 text-xs font-bold tracking-wider text-white">
                        {s.id}
                      </span>
                      <p className="mt-1 font-display text-lg font-bold text-brand-deep">
                        {s.placeName}
                      </p>
                      <p className="text-xs text-brand-deep/60">
                        {s.type === "farmer_mandi" ? "Producer Gate Pass" : "Commercial Procurement Pickup"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          s.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.status === "SCHEDULED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <CheckCircle2 className="size-3" />
                        {s.status}
                      </span>
                      {s.bayNumber && (
                        <p className="mt-1 text-xs font-bold text-teal-800">{s.bayNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-xl bg-brand-deep/5 p-2.5">
                      <p className="text-brand-deep/50 uppercase tracking-wider text-[10px] font-semibold">
                        Commodity & Lot
                      </p>
                      <p className="mt-0.5 font-bold text-brand-deep">
                        {s.cropName} · {s.quantity} Qtl
                      </p>
                    </div>

                    <div className="rounded-xl bg-brand-deep/5 p-2.5">
                      <p className="text-brand-deep/50 uppercase tracking-wider text-[10px] font-semibold">
                        Vehicle Reg.
                      </p>
                      <p className="mt-0.5 font-bold text-brand-deep">
                        {s.vehicleNumber} ({s.vehicleType.split(" ")[0]})
                      </p>
                    </div>

                    <div className="rounded-xl bg-brand-deep/5 p-2.5">
                      <p className="text-brand-deep/50 uppercase tracking-wider text-[10px] font-semibold">
                        Date & Window
                      </p>
                      <p className="mt-0.5 font-bold text-brand-deep">
                        {s.slotDate}
                      </p>
                      <p className="text-[10px] text-brand-deep/70">{s.timeWindow}</p>
                    </div>

                    <div className="rounded-xl bg-brand-deep/5 p-2.5">
                      <p className="text-brand-deep/50 uppercase tracking-wider text-[10px] font-semibold">
                        Registered Contact
                      </p>
                      <p className="mt-0.5 font-bold text-brand-deep truncate">
                        {s.userName}
                      </p>
                      <p className="text-[10px] text-brand-deep/70">{s.phone}</p>
                    </div>
                  </div>

                  {/* SMS Delivery Badge */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-deep/10 pt-3 text-[11px]">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium shrink-0">
                      <Phone className="size-3" />
                      Twilio Live SMS Verified
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1 rounded-lg border border-brand-deep/20 bg-white px-2.5 py-1 text-brand-deep hover:bg-gray-50 min-h-[32px]"
                      >
                        <Printer className="size-3" />
                        Print Pass
                      </button>
                      {s.status !== "CANCELLED" && (
                        <button
                          type="button"
                          onClick={() => cancelSlot(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-red-700 hover:bg-red-100 min-h-[32px]"
                        >
                          <XCircle className="size-3" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Booking Form */}
          <section className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[var(--shadow-glass)] backdrop-blur-2xl sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-brand-deep">
              {activeTab === "farmer_mandi"
                ? "Book Mandi Weighbridge & Unloading Slot"
                : "Schedule Commercial Harvest Inspection & Pickup"}
            </h2>
            <p className="mt-1 text-xs text-brand-deep/70">
              Fill in your load details to generate your digital gate pass with assigned bay.
            </p>

            <form onSubmit={handleBooking} className="mt-6 space-y-4">
              {/* Region Selector Override */}
              <div>
                <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                  Mandi Yard / Market Location
                </label>
                <RegionSelector />
              </div>

              {/* Crop & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Crop / Commodity
                  </label>
                  <select
                    className={inputClass}
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                  >
                    {CROPS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {cropName(c.id, lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Estimated Load (Quintals)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 20"
                  />
                </div>
              </div>

              {/* Date & Time Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    required
                    value={slotDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSlotDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Time Window
                  </label>
                  <select
                    className={inputClass}
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(e.target.value)}
                  >
                    {TIME_WINDOWS.map((w) => (
                      <option key={w.id} value={w.label}>
                        {w.label} ({w.bays})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Type & Reg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Transport Vehicle
                  </label>
                  <select
                    className={inputClass}
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Vehicle Reg. Number
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. MH-15-EG-4921"
                  />
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Driver / Producer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-deep/70 mb-1.5">
                    Mobile Phone (For Twilio SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition hover:bg-brand/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Generating Gate Pass & Sending SMS..."
                ) : (
                  <>
                    <QrCode className="size-4" />
                    Confirm Booking & Dispatch Twilio SMS
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Side Info & Benchmark preview */}
          <aside className="space-y-4">
            {benchmark && (
              <div className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                  Live Market Benchmark Reference
                </span>
                <p className="mt-2 font-display text-2xl font-bold text-brand-deep">
                  {cropName(benchmark.cropId, lang)}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-brand-deep/10 pt-3">
                  <div>
                    <p className="text-xs text-brand-deep/60">Modal Price</p>
                    <p className="text-lg font-bold text-brand">{formatRupees(benchmark.modal)} / Qtl</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-deep/60">Price Range</p>
                    <p className="text-xs font-semibold text-brand-deep">
                      {formatRupees(benchmark.min)} – {formatRupees(benchmark.max)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[var(--shadow-glass)] backdrop-blur-2xl">
              <h3 className="font-display text-lg font-semibold text-brand-deep">
                Why Book a Slot in Advance?
              </h3>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-brand-deep/75">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Zero Waiting Time:</strong> Skip the 4-6 hour truck queue outside the APMC yard.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Guaranteed Weighbridge Bay:</strong> Assigned bay ready with automated calibration.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Real-time Twilio SMS Gate Pass:</strong> SMS ticket shown at entrance acts as valid entry pass.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
