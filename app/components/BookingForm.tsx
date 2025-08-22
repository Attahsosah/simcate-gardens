"use client";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/app/components/DateRangePicker";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function BookingForm({
  roomId,
  capacity,
}: {
  roomId: string;
  capacity: number;
}) {
  const { status } = useSession();
  const [range, setRange] = useState<DateRange | undefined>();
  const [numGuests, setNumGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (status !== "authenticated") {
      window.location.href = "/api/auth/signin";
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
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create booking");
      toast.success("Booking created successfully!");
      // Reset form
      setRange(undefined);
      setNumGuests(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create booking";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 min-w-[300px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Room</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Dates
          </label>
          <DateRangePicker onChange={setRange} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-12 text-center font-medium">{numGuests}</span>
            <button
              type="button"
              onClick={() => setNumGuests(Math.min(capacity, numGuests + 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-sm text-gray-500">of {capacity}</span>
          </div>
        </div>

        {status === "authenticated" ? (
          <button
            onClick={submit}
            disabled={submitting || !range?.from || !range?.to}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Booking...
              </div>
            ) : (
              "Book Now"
            )}
          </button>
        ) : (
          <button
            onClick={() => window.location.href = "/api/auth/signin"}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign in to Book
          </button>
        )}
      </div>
    </div>
  );
}


