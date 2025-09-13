import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingForm from "@/app/components/BookingForm";
import ImageCarousel from "@/app/components/ImageCarousel";
import RoomImageUpload from "@/app/components/RoomImageUpload";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  
  let room;
  try {
    room = await prisma.room.findUnique({
      where: { id },
      include: {
        resort: true,
        amenities: true,
        roomImages: true,
      },
    });
  } catch (error) {
    console.error('Database error in room page:', error);
    // Return a fallback page if database is not available
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Room Details</h1>
            <p className="text-gray-600">Room information will be available when the database is connected.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    notFound();
  }

  // Debug: Log room data to see what we're working with
  console.log('Room data loaded:', {
    id: room.id,
    name: room.name,
    previewImageUrl: room.previewImageUrl,
    roomImagesCount: room.roomImages?.length || 0,
    roomImages: room.roomImages
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-indigo-600 transition-colors">Rooms</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{room.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Images */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Room Gallery</h3>
              {room.roomImages && room.roomImages.length > 0 ? (
                <ImageCarousel 
                  images={room.previewImageUrl ? 
                    [{ id: 'preview', url: room.previewImageUrl, caption: `${room.name} - Preview` }, ...room.roomImages] : 
                    room.roomImages
                  } 
                  alt={room.name}
                  className="w-full"
                />
              ) : room.previewImageUrl ? (
                <ImageCarousel 
                  images={[{ id: 'preview', url: room.previewImageUrl, caption: `${room.name} - Preview` }]} 
                  alt={room.name}
                  className="w-full"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No images available for this room yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Upload images using the form below.</p>
                </div>
              )}
            </div>

            {/* Room Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{room.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">{room.resort.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span className="text-sm font-medium">Up to {room.capacity} guests</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${room.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">per night</div>
                </div>
              </div>

              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{room.description}</p>

              {/* Room Type Badge */}
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {room.roomType.replace('_', ' ')}
                </span>
              </div>

              {/* Amenities */}
              {room.amenities.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {room.amenities.map((amenityItem, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{amenityItem.amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Add More Images</h3>
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
                  <RoomImageUpload roomId={room.id} />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm roomId={room.id} capacity={room.capacity} price={room.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
