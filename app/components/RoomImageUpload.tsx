"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RoomImageUploadProps {
  roomId: string;
}

export default function RoomImageUpload({ roomId }: RoomImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'room');
      formData.append('id', roomId);
      formData.append('caption', `Room image for ${roomId}`);

      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh the page to show the new image
        router.refresh();
        alert('Image uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Error uploading image: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div className="text-center">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            {isUploading ? (
              <svg className="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {isUploading ? 'Uploading...' : 'Add Room Images'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {isUploading 
                ? 'Please wait while your image is being uploaded'
                : 'Drag and drop an image here, or click to select a file'
              }
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            Supports: JPG, PNG, GIF (max 5MB)
          </div>
        </div>
      </div>
    </div>
  );
}
