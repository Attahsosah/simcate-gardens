"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FacilityType, Facility } from "@prisma/client";

interface EditFacilityFormProps {
  facility: Facility & {
    resort: { id: string; name: string };
  };
}

export default function EditFacilityForm({ facility }: EditFacilityFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(facility.imageUrl || null);
  const [formData, setFormData] = useState({
    name: facility.name,
    description: facility.description || "",
    facilityType: facility.facilityType,
    isActive: facility.isActive,
  });

  const facilityTypes: { value: FacilityType; label: string }[] = [
    { value: "POOL", label: "Pool" },
    { value: "SPA", label: "Spa" },
    { value: "GYM", label: "Gym" },
    { value: "RESTAURANT", label: "Restaurant" },
    { value: "BAR", label: "Bar" },
    { value: "CONFERENCE_ROOM", label: "Conference Room" },
    { value: "TENNIS_COURT", label: "Tennis Court" },
    { value: "GOLF_COURSE", label: "Golf Course" },
    { value: "BEACH_ACCESS", label: "Beach Access" },
    { value: "PARKING", label: "Parking" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = facility.imageUrl;

      // Upload image if a new one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('type', 'facility');
        formData.append('id', facility.id);

        const uploadResponse = await fetch('/api/admin/images', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Update facility
      const response = await fetch(`/api/admin/facilities/${facility.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      });

      if (response.ok) {
        router.push("/admin/facilities");
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      alert("An error occurred while updating the facility");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Facility Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <label htmlFor="facilityType" className="block text-sm font-medium text-gray-700 mb-2">
            Facility Type *
          </label>
          <select
            id="facilityType"
            required
            value={formData.facilityType}
            onChange={(e) => setFormData(prev => ({ ...prev, facilityType: e.target.value as FacilityType }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            {facilityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          Facility Image
        </label>
        <div className="space-y-4">
          {imagePreview && (
            <div className="w-full max-w-md">
              <img
                src={imagePreview}
                alt="Facility preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />
          <p className="text-sm text-gray-500">
            Upload a new image to replace the current one. Leave empty to keep the current image.
          </p>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
        <p className="text-sm text-gray-500 mt-1">
          Inactive facilities will not be displayed to guests
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/facilities")}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Facility"}
        </button>
      </div>
    </form>
  );
}


