import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditFacilityForm from "./EditFacilityForm";

interface EditFacilityPageProps {
  params: { id: string };
}

export default async function EditFacilityPage({ params }: EditFacilityPageProps) {
  const { id } = await params;
  const facility = await prisma.facility.findUnique({
    where: { id },
    include: {
      resort: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!facility) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Facility</h1>
        <p className="text-gray-600 mt-1">
          Update facility information and settings
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <EditFacilityForm facility={facility} />
      </div>
    </div>
  );
}
