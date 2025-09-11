import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface FacilityPageProps {
  params: { id: string };
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { id } = await params;
  const facility = await prisma.facility.findUnique({
    where: { id },
    include: {
      resort: true,
    },
  });

  if (!facility) {
    notFound();
  }

  const facilityTypeLabels: Record<string, string> = {
    POOL: "Pool",
    RESTAURANT: "Restaurant",
    SPA: "Spa",
    GYM: "Gym",
    BAR: "Bar",
    BEACH_ACCESS: "Beach Access",
    PARKING: "Parking",
    CONFERENCE_ROOM: "Conference Room",
    TENNIS_COURT: "Tennis Court",
    GOLF_COURSE: "Golf Course",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{facility.name}</h1>
          <p className="text-lg text-gray-600">{facility.description}</p>
        </div>

        {facility.imageUrl && (
          <div className="mb-8">
            <img
              src={facility.imageUrl}
              alt={facility.name}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Type:</span>
                <span className="inline-flex px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                  {facilityTypeLabels[facility.facilityType] || facility.facilityType}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  facility.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {facility.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resort Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Resort:</span> {facility.resort.name}</p>
              <p><span className="font-medium">Location:</span> {facility.resort.address}, {facility.resort.city}, {facility.resort.country}</p>
              {facility.resort.phone && (
                <p><span className="font-medium">Phone:</span> {facility.resort.phone}</p>
              )}
              {facility.resort.email && (
                <p><span className="font-medium">Email:</span> {facility.resort.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/resort"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Resort
          </a>
        </div>
      </div>
    </div>
  );
}
