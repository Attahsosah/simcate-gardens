import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditRoomForm from "./EditRoomForm";

interface EditRoomPageProps {
  params: { id: string };
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
              amenities: true,
      resort: true,
    },
  });

  if (!room) {
    notFound();
  }

  // Get available amenities from the room's existing amenities
  const availableAmenities = [
    "WiFi",
    "Air Conditioning", 
    "TV",
    "Mini Bar",
    "Balcony",
    "Ocean View",
    "Room Service",
    "Safe",
    "Coffee Maker",
    "Iron",
    "Hair Dryer",
    "Bathrobe",
    "Slippers"
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Room</h2>
        <p className="text-gray-600 mt-1">Update room information and amenities</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <EditRoomForm room={room} amenities={availableAmenities} />
      </div>
    </div>
  );
}
