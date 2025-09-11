"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomType } from "@prisma/client";

interface AddRoomFormProps {
  amenities: string[];
  resortId: string;
}

export default function AddRoomForm({ amenities, resortId }: AddRoomFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "1",
    roomType: "STANDARD" as RoomType,
    selectedAmenities: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const roomTypes: { value: RoomType; label: string }[] = [
    { value: "STANDARD", label: "Standard" },
    { value: "DELUXE", label: "Deluxe" },
    { value: "SUITE", label: "Suite" },
    { value: "VILLA", label: "Villa" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPreviewImage(file);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
  };

  const uploadImages = async (roomId: string) => {
    setUploadingImages(true);
    try {
      // Upload preview image first if provided
      if (previewImage) {
        const previewFormData = new FormData();
        previewFormData.append('file', previewImage);
        previewFormData.append('type', 'room');
        previewFormData.append('id', roomId);
        previewFormData.append('caption', `Preview image for ${formData.name}`);

        const previewResponse = await fetch('/api/admin/images', {
          method: 'POST',
          body: previewFormData,
        });

        if (!previewResponse.ok) {
          throw new Error(`Failed to upload preview image: ${previewImage.name}`);
        }

        const previewData = await previewResponse.json();
        
        // Update room with preview image URL
        await fetch(`/api/admin/rooms/${roomId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ previewImageUrl: previewData.url }),
        });
      }

      // Upload additional room images
      if (images.length > 0) {
        for (const image of images) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', image);
          uploadFormData.append('type', 'room');
          uploadFormData.append('id', roomId);
          uploadFormData.append('caption', `Room image for ${formData.name}`);

          const response = await fetch('/api/admin/images', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload image: ${image.name}`);
          }
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First create the room
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          resortId,
        }),
      });

      if (response.ok) {
        let roomData;
        try {
          roomData = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse response as JSON:", jsonError);
          alert("Room created successfully, but there was an issue with the response format.");
          router.push("/admin/rooms");
          router.refresh();
          return;
        }

        const roomId = roomData.id;

        // Then upload images if any
        if (images.length > 0) {
          try {
            await uploadImages(roomId);
          } catch (imageError) {
            console.error("Image upload error:", imageError);
            alert(`Room created successfully, but there was an error uploading images: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
          }
        }

        router.push("/admin/rooms");
        router.refresh();
      } else {
        let errorMessage = 'Unknown error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON (e.g., HTML error page), use status text
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Room creation error:", error);
      alert(`An error occurred while creating the room: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            placeholder="e.g., Ocean View Deluxe"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            placeholder="350.00"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            placeholder="2"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            placeholder="Describe the room, its features, and what makes it special..."
        />
      </div>

      {/* Preview Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview Image
        </label>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              id="previewImage"
              accept="image/*"
              onChange={handlePreviewImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload a preview image that will be shown on room listings and as the main image. This should be the best representation of the room.
            </p>
          </div>

          {/* Preview Image Display */}
          {previewImage && (
            <div className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 max-w-md">
                <img
                  src={URL.createObjectURL(previewImage)}
                  alt="Preview"
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

      {/* Room Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Room Images
        </label>
        <div className="space-y-4">
          {/* Image Upload Input */}
          <div>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload multiple images to showcase the room. Supported formats: JPG, PNG, WebP
            </p>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {image.name}
                  </p>
                </div>
              ))}
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
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || uploadingImages}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (uploadingImages ? "Uploading Images..." : "Creating Room...") : "Create Room"}
        </button>
      </div>
    </form>
  );
}
