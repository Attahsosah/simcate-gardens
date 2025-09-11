"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomType, Amenity, Room } from "@prisma/client";

interface EditRoomFormProps {
  room: Room & {
    amenities: Array<{
      amenity: Amenity;
    }>;
    resort: { id: string; name: string };
  };
  amenities: Amenity[];
}

export default function EditRoomForm({ room, amenities }: EditRoomFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: room.name,
    description: room.description,
    price: room.price.toString(),
    capacity: room.capacity.toString(),
    roomType: room.roomType,
    selectedAmenities: room.amenities.map(a => a.amenity),
  });
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [uploadingPreview, setUploadingPreview] = useState(false);

  const roomTypes: { value: RoomType; label: string }[] = [
    { value: "STANDARD", label: "Standard" },
    { value: "DELUXE", label: "Deluxe" },
    { value: "SUITE", label: "Suite" },
    { value: "VILLA", label: "Villa" },
    { value: "CABIN", label: "Cabin" },
    { value: "FAMILY", label: "Family" },
  ];

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPreviewImage(file);
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
  };

  const uploadPreviewImage = async () => {
    if (!previewImage) return;

    setUploadingPreview(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', previewImage);
      uploadFormData.append('type', 'room');
      uploadFormData.append('id', room.id);
      uploadFormData.append('caption', `Preview image for ${formData.name}`);

      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload preview image: ${previewImage.name}`);
      }

      const data = await response.json();
      
      // Update room with preview image URL
      await fetch(`/api/admin/rooms/${room.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previewImageUrl: data.url }),
      });

      return data.url;
    } catch (error) {
      console.error('Error uploading preview image:', error);
      throw error;
    } finally {
      setUploadingPreview(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload preview image first if provided
      if (previewImage) {
        await uploadPreviewImage();
      }

      const response = await fetch(`/api/admin/rooms/${room.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        router.push("/admin/rooms");
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      alert("An error occurred while updating the room");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenityId)
        ? prev.selectedAmenities.filter(id => id !== amenityId)
        : [...prev.selectedAmenities, amenityId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Room Name *
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
          <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
            Room Type *
          </label>
          <select
            id="roomType"
            required
            value={formData.roomType}
            onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value as RoomType }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            {roomTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price per Night ($) *
          </label>
          <input
            type="number"
            id="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Capacity *
          </label>
          <input
            type="number"
            id="capacity"
            required
            min="1"
            max="10"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
      </div>

      {/* Preview Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview Image
        </label>
        <div className="space-y-4">
          {/* Current Preview Image */}
          {room.previewImageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current preview image:</p>
              <div className="relative group max-w-md">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={room.previewImageUrl}
                    alt="Current preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* New Preview Image Upload */}
          <div>
            <input
              type="file"
              id="previewImage"
              accept="image/*"
              onChange={handlePreviewImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload a new preview image to replace the current one. This will be shown on room listings and as the main image.
            </p>
          </div>

          {/* New Preview Image Display */}
          {previewImage && (
            <div className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 max-w-md">
                <img
                  src={URL.createObjectURL(previewImage)}
                  alt="New preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removePreviewImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <p className="mt-1 text-xs text-gray-500 truncate">
                {previewImage.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/rooms")}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Room"}
        </button>
      </div>
    </form>
  );
}
