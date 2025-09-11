"use client";

import { useState } from "react";
import { format } from "date-fns";
import { BookingStatus } from "@prisma/client";
import Toast from "@/app/components/Toast";

interface BookingCardProps {
  booking: {
    id: string;
    checkIn: string;
    checkOut: string;
    numGuests: number;
    totalCents: number;
    status: BookingStatus;
    room: {
      name: string;
      resort: {
        name: string;
      };
    };
  };
  onStatusUpdate: (bookingId: string, newStatus: BookingStatus) => void;
}

export default function BookingCard({ booking, onStatusUpdate }: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        const data = await response.json();
        onStatusUpdate(booking.id, data.booking.status);
        setToast({ message: data.message, type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: `Error: ${error.error}`, type: "error" });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setToast({ message: 'An error occurred while cancelling the booking', type: "error" });
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {booking.room.resort.name}
          </h3>
          <p className="text-gray-700 mb-2">{booking.room.name}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(booking.checkIn), "MMM dd, yyyy")} - {format(new Date(booking.checkOut), "MMM dd, yyyy")}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {booking.numGuests} guest{booking.numGuests > 1 ? 's' : ''}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              ${(booking.totalCents / 100).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-end space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            booking.status === 'CONFIRMED' 
              ? 'bg-green-100 text-green-800'
              : booking.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : booking.status === 'CANCELLED'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {booking.status}
          </span>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
