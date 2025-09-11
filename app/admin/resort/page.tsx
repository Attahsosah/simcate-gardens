import prisma from "@/lib/prisma";
import ResortEditForm from "./ResortEditForm";

export default async function AdminResortPage() {
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
        <h2 className="text-2xl font-bold text-gray-900">Resort Information</h2>
        <p className="text-gray-600 mt-1">Manage your resort&apos;s details and settings</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <ResortEditForm resort={resort} />
      </div>
    </div>
  );
}
