"use client";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import ModernDatePicker from "@/app/components/ModernDatePicker";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Users, Calendar, CreditCard, Shield } from "lucide-react";

export default function BookingForm({
  roomId,
  capacity,
  price,
}: {
  roomId: string;
  capacity: number;
  price: number;
}) {
  const { status } = useSession();
  const [range, setRange] = useState<DateRange | undefined>();
  const [numGuests, setNumGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const getNights = () => {
    if (!range?.from || !range?.to) return 0;
    const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalPrice = () => {
    const nights = getNights();
    return nights * price;
  };

  const getTaxes = () => {
    return getTotalPrice() * 0.12; // 12% tax
  };

  const getTotalWithTaxes = () => {
    return getTotalPrice() + getTaxes();
  };

  async function submit() {
    if (status !== "authenticated") {
      window.location.href = "/signin";
      return;
    }
    if (!range?.from || !range?.to) {
      toast.error("Please select a date range");
      return;
    }
    if (numGuests < 1 || numGuests > capacity) {
      toast.error(`Guests must be 1 - ${capacity}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          numGuests,
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Booking API error:", res.status, errorText);
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      toast.success("Booking created successfully!");
      // Reset form
      setRange(undefined);
      setNumGuests(1);
    } catch (err: unknown) {
      console.error("Booking error:", err);
      const message = err instanceof Error ? err.message : "Failed to create booking";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 sticky top-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          ${price.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600 font-medium">per night</div>
      </div>

      <div className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
            Select Dates
          </label>
          <ModernDatePicker onChange={setRange} />
        </div>
        
        {/* Guest Selection */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <Users className="w-4 h-4 mr-2 text-indigo-600" />
            Number of Guests
          </label>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-indigo-300 transition-all duration-200"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-16 text-center font-bold text-lg text-gray-900">{numGuests}</span>
              <button
                type="button"
                onClick={() => setNumGuests(Math.min(capacity, numGuests + 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-indigo-300 transition-all duration-200"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <span className="text-sm text-gray-600 font-medium">of {capacity} max</span>
          </div>
        </div>

        {/* Price Breakdown */}
        {range?.from && range?.to && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">${price.toFixed(2)} × {getNights()} night{getNights() !== 1 ? &apos;s&apos; : &apos;&apos;}</span>
              <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes & fees</span>
              <span className="font-medium">${getTaxes().toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${getTotalWithTaxes().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-green-50 rounded-lg p-3">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="font-medium">Secure booking guaranteed</span>
        </div>

        {/* Book Button */}
        {status === "authenticated" ? (
          <button
            onClick={submit}
            disabled={submitting || !range?.from || !range?.to}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Book Now
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={() => window.location.href = "/signin"}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              Sign in to Book
            </div>
          </button>
        )}

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Free cancellation up to 24 hours before check-in</p>
          <p>Instant confirmation</p>
        </div>
      </div>
    </div>
  );
}


