import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function HotelsPage() {
  const hotels = await prisma.hotel.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      rooms: {
        take: 1,
        orderBy: { priceCents: "asc" },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Amazing Hotels</h1>
        <p className="text-gray-700">Find the perfect place to stay for your next trip</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <div className="text-white text-center">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium">{hotel.city}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
              <p className="text-gray-700 text-sm mb-3">
                {hotel.city}, {hotel.country}
              </p>
              {hotel.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {hotel.description}
                </p>
              )}
              {hotel.rooms.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">From </span>
                  <span className="text-lg font-semibold text-indigo-600">
                    ${(hotel.rooms[0].priceCents / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600"> per night</span>
                </div>
              )}
              <Link
                href={`/hotels/${hotel.id}`}
                className="inline-block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-600">Check back later for new listings</p>
        </div>
      )}
    </div>
  );
}



