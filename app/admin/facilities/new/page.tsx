import AddFacilityForm from "./AddFacilityForm";

export default function NewFacilityPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Facility</h1>
        <p className="text-gray-600 mt-1">
          Create a new facility for your resort
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <AddFacilityForm />
      </div>
    </div>
  );
}


