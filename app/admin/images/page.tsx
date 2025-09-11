"use client";

import { useState, useEffect } from "react";
import Toast from "@/app/components/Toast";

interface Image {
  id: string;
  url: string;
  caption?: string;
  type: "resort" | "room";
  entityId: string;
  entityName: string;
  createdAt: string;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<"resort" | "room">("resort");
  const [selectedEntity, setSelectedEntity] = useState("");
  const [entities, setEntities] = useState<{ id: string; name: string }[]>([]);
  const [caption, setCaption] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    fetchImages();
    fetchEntities();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntities = async () => {
    try {
      const [resortResponse, roomsResponse] = await Promise.all([
        fetch('/api/admin/resort'),
        fetch('/api/admin/rooms')
      ]);

      const entities = [];
      
      if (resortResponse.ok) {
        const resortData = await resortResponse.json();
        // Handle both single resort and array of resorts
        if (Array.isArray(resortData)) {
          entities.push(...resortData.map((resort: { id: string; name: string }) => ({ id: resort.id, name: resort.name })));
        } else {
          entities.push({ id: resortData.id, name: resortData.name });
        }
      }

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        entities.push(...roomsData.map((room: { id: string; name: string }) => ({ id: room.id, name: room.name })));
      }

      console.log('Fetched entities:', entities); // Debug log
      setEntities(entities);
      
      // Debug: Log filtered entities for current upload type
      const filteredEntities = entities.filter(entity => {
        if (!entity.name) return false;
        if (uploadType === "resort") {
          return entity.name.toLowerCase().includes("resort");
        } else {
          return !entity.name.toLowerCase().includes("resort");
        }
      });
      console.log(`Filtered entities for ${uploadType}:`, filteredEntities);
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedEntity) {
      setToast({ message: "Please select a file and entity", type: "error" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('type', uploadType);
    formData.append('entityId', selectedEntity);
    formData.append('caption', caption);

    try {
      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setToast({ message: "Image uploaded successfully", type: "success" });
        setSelectedFile(null);
        setCaption("");
        setSelectedEntity("");
        fetchImages();
      } else {
        const error = await response.json();
        setToast({ message: `Error: ${error.error}`, type: "error" });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setToast({ message: 'An error occurred while uploading the image', type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setToast({ message: "Image deleted successfully", type: "success" });
        fetchImages();
      } else {
        const error = await response.json();
        setToast({ message: `Error: ${error.error}`, type: "error" });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setToast({ message: 'An error occurred while deleting the image', type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading images...</div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Image Management</h2>
          <div className="text-sm text-gray-600">
            Total Images: {images.length}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Type
              </label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as "resort" | "room")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="resort">Resort Image</option>
                <option value="room">Room Image</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {uploadType === "resort" ? "Resort" : "Room"}
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select {uploadType === "resort" ? "Resort" : "Room"}</option>
                {entities
                  .filter(entity => {
                    if (!entity.name) return false;
                    if (uploadType === "resort") {
                      return entity.name.toLowerCase().includes("resort");
                    } else {
                      return !entity.name.toLowerCase().includes("resort");
                    }
                  })
                  .map(entity => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name || "Unnamed Entity"}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter image caption..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !selectedEntity}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={image.url}
                  alt={image.caption || "Resort image"}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    image.type === 'resort' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {image.type === 'resort' ? 'Resort' : 'Room'}
                  </span>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {image.entityName}
                </h4>
                {image.caption && (
                  <p className="text-sm text-gray-600 mb-2">{image.caption}</p>
                )}
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">No images uploaded yet</div>
            <p className="text-sm text-gray-600">Upload your first image using the form above</p>
          </div>
        )}
      </div>
    </>
  );
}
