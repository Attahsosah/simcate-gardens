import prisma from "@/lib/prisma";
import { RoomType } from "@prisma/client";
import AddRoomForm from "./AddRoomForm";

export default async function AddRoomPage() {
  // Define common hotel amenities
  const amenities = [
    "Wi-Fi",
    "Air Conditioning",
    "TV",
    "Mini Bar",
    "Safe",
    "Balcony",
    "Ocean View",
    "City View",
    "Room Service",
    "Daily Housekeeping",
    "Coffee Maker",
    "Refrigerator",
    "Microwave",
    "Iron & Ironing Board",
    "Hair Dryer",
    "Bathrobe",
    "Slippers",
    "Work Desk",
    "Sofa",
    "King Size Bed",
    "Queen Size Bed",
    "Twin Beds",
    "Private Bathroom",
    "Bathtub",
    "Shower",
    "Pool Access",
    "Gym Access",
    "Spa Access",
    "Concierge Service",
    "Laundry Service"
  ].sort();

  // Get the resort (assuming single resort)
  const resort = await prisma.resort.findFirst();

  if (!resort) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">No resort found. Please create a resort first.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Room</h2>
        <p className="text-gray-600 mt-1">Create a new room for your resort</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <AddRoomForm amenities={amenities} resortId={resort.id} />
      </div>
    </div>
  );
}
