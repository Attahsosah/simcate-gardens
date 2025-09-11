import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "@/app/components/BookingForm";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { 
      rooms: {
        include: {
          amenities: true
        }
      } 
    },
  });
  if (!hotel) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hotel Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <div className="flex items-center text-gray-700 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{hotel.city}, {hotel.country}</span>
            </div>
            {hotel.description && (
              <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
                {hotel.description}
              </p>
            )}
          </div>
          <div className="bg-gradient-to-br from-indigo-400 to-purple-500 w-24 h-24 rounded-lg flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
        
        {hotel.rooms.length > 0 ? (
          <div className="grid gap-6">
            {hotel.rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                    {room.description && (
                      <p className="text-gray-700 mb-3">{room.description}</p>
                    )}
                                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Up to {room.capacity} guests
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        ${(room.priceCents / 100).toFixed(2)} per night
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    {room.amenities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map(({ amenity }) => (
                            <span
                              key={amenity.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {amenity.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:ml-6">
                    <BookingForm roomId={room.id} capacity={room.capacity} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms available</h3>
            <p className="text-gray-600">This hotel doesn&apos;t have any rooms listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}



