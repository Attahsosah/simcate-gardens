import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function RoomsPage() {
  let rooms = [];
  
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.log('Database not available, using fallback content...');
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 min-h-screen">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Rooms</h1>
            <p className="text-xl text-gray-300">Room information will be available when the database is connected.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-modern overflow-hidden">
              <img 
                src="/uploads/room_cmenkzk2s0005s1e17zwz5qto_1756070531906.jpg" 
                alt="Ocean View Suite"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Ocean View Suite</h3>
                <p className="text-gray-300 text-sm mb-4">A luxurious suite with stunning ocean views</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Up to 2 guests</span>
                  <span className="text-lg font-semibold text-indigo-400">$299.99</span>
                </div>
              </div>
            </div>
            <div className="card-modern overflow-hidden">
              <img 
                src="/uploads/room_room-2_1757559742211.jpg" 
                alt="Garden Villa"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Garden Villa</h3>
                <p className="text-gray-300 text-sm mb-4">A peaceful villa surrounded by tropical gardens</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Up to 4 guests</span>
                  <span className="text-lg font-semibold text-indigo-400">$399.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      rooms = await prisma.room.findMany({
        include: {
          resort: true,
          amenities: true,
        },
        orderBy: { price: "asc" },
      });
    }
  } catch (error) {
    console.error('Error fetching rooms data:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 min-h-screen">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Rooms</h1>
          <p className="text-xl text-gray-300">Unable to load room information at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 min-h-screen">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Rooms</h1>
        <p className="text-xl text-gray-300">Choose from our selection of comfortable accommodations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <div key={room.id} className="card-modern overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">{room.name}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{room.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Up to {room.capacity} guests</span>
                <span className="text-lg font-semibold text-indigo-400">
                  ${room.price.toFixed(2)}
                </span>
              </div>

              {room.amenities.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenityItem) => (
                      <span
                        key={amenityItem.id}
                        className="inline-flex px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      >
                        {amenityItem.amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-600/20 text-gray-300 border border-gray-600/30">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Link
                href={`/rooms/${room.id}`}
                className="btn-primary w-full text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
