"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { BookingStatus } from "@prisma/client";
import Toast from "@/app/components/Toast";

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  totalCents: number;
  status: BookingStatus;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  room: {
    id: string;
    name: string;
    resort: {
      id: string;
      name: string;
    };
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/admin/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusLabels: Record<BookingStatus, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  const statusColors: Record<BookingStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setUpdatingBooking(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the booking in the local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: data.booking.status }
            : booking
        ));
        setToast({ message: data.message, type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: `Error: ${error.error}`, type: "error" });
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setToast({ message: 'An error occurred while updating the booking', type: "error" });
    } finally {
      setUpdatingBooking(null);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <div className="text-sm text-gray-600">
          Total Bookings: {bookings.length}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user.name || "Guest"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.room.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.room.resort.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</div>
                      <div className="text-gray-600">to</div>
                      <div>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.numGuests} guest{booking.numGuests !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(booking.totalCents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>
                      {statusLabels[booking.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            disabled={updatingBooking === booking.id}
                          >
                            {updatingBooking === booking.id ? 'Confirming...' : 'Confirm'}
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            disabled={updatingBooking === booking.id}
                          >
                            {updatingBooking === booking.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          disabled={updatingBooking === booking.id}
                        >
                          {updatingBooking === booking.id ? 'Marking Complete...' : 'Mark Complete'}
                        </button>
                      )}
                      {booking.status === 'CANCELLED' && (
                        <span className="text-gray-500 text-xs">No actions available</span>
                      )}
                      {booking.status === 'COMPLETED' && (
                        <span className="text-gray-500 text-xs">No actions available</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">No bookings found</div>
          <p className="text-sm text-gray-600">Bookings will appear here once guests make reservations</p>
        </div>
      )}
      </div>
    </>
  );
}
