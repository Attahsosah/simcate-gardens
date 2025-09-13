import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import RoomDetailClient from "@/app/components/RoomDetailClient";

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

  return <RoomDetailClient room={room} />;
}
