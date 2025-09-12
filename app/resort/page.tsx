import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function ResortPage() {
  let resort = null;
  
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.log('Database not available, using fallback content...');
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paradise Beach Resort & Spa</h1>
            <p className="text-gray-600">Resort information will be available when the database is connected.</p>
            <div className="mt-8">
              <img 
                src="/uploads/resort_resort-1_1756070466330.jpg" 
                alt="Paradise Beach Resort & Spa"
                className="mx-auto rounded-lg shadow-lg max-w-2xl"
              />
            </div>
          </div>
        </div>
      );
    } else {
      resort = await prisma.resort.findFirst({
        include: {
          rooms: {
            orderBy: { price: "asc" },
          },
          facilities: {
            where: { isActive: true },
            orderBy: { name: "asc" },
          },
        },
      });

      if (!resort) {
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Resort Not Found</h1>
              <p className="text-gray-600">The resort information is not available.</p>
            </div>
          </div>
        );
      }
    }
  } catch (error) {
    console.error('Error fetching resort data:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resort Information</h1>
          <p className="text-gray-600">Unable to load resort information at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Resort Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{resort.name}</h1>
        <p className="text-gray-700 text-lg mb-4">{resort.description}</p>
        <div className="flex items-center text-gray-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{resort.address}</span>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Resort Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resort.facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {facility.imageUrl && (
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={facility.imageUrl}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
                <p className="text-gray-700 mb-4">{facility.description}</p>
                <Link
                  href={`/facilities/${facility.id}`}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accommodations Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Accommodations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resort.rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
              <p className="text-gray-700 text-sm mb-3">{room.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Up to {room.capacity} guests</span>
                <span className="text-lg font-semibold text-indigo-600">
                  ${room.price.toFixed(2)}
                </span>
              </div>
              <Link
                href={`/rooms/${room.id}`}
                className="inline-block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Experience Paradise?</h3>
        <p className="text-indigo-100 mb-6">
          Book your stay today and discover the perfect blend of luxury and tropical tranquility.
        </p>
        <Link
          href="/rooms"
          className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
        >
          Book Your Stay
        </Link>
      </div>
    </div>
  );
}
