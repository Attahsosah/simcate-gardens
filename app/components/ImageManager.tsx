"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageManagerProps {
  images: Array<{
    id: string;
    url: string;
    caption?: string | null;
  }>;
  onImageDeleted: (imageId: string) => void;
  onImageUpdated: (imageId: string, caption: string) => void;
  alt: string;
  className?: string;
}

export default function ImageManager({ 
  images, 
  onImageDeleted, 
  onImageUpdated, 
  alt, 
  className = "" 
}: ImageManagerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isReplacing, setIsReplacing] = useState<string | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className={`relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-indigo-600 font-medium">Room images coming soon</p>
          </div>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(imageId);
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onImageDeleted(imageId);
        // If we deleted the current image, adjust the index
        if (currentIndex >= images.length - 1) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      } else {
        const error = await response.json();
        alert(`Error deleting image: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditCaption = (imageId: string, currentCaption: string) => {
    setEditingCaption(imageId);
    setCaptionValue(currentCaption || "");
  };

  const handleSaveCaption = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption: captionValue }),
      });

      if (response.ok) {
        onImageUpdated(imageId, captionValue);
        setEditingCaption(null);
        setCaptionValue("");
      } else {
        const error = await response.json();
        alert(`Error updating caption: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating caption:', error);
      alert('Failed to update caption. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCaption(null);
    setCaptionValue("");
  };

  const handleReplaceImage = async (imageId: string) => {
    if (!replaceFile) return;

    setIsReplacing(imageId);
    try {
      // Find the room ID from the current image
      const currentImage = images.find(img => img.id === imageId);
      if (!currentImage) {
        throw new Error('Image not found');
      }

      const formData = new FormData();
      formData.append('file', replaceFile);
      formData.append('type', 'room');
      formData.append('id', 'temp'); // We'll get the room ID from the image
      formData.append('replaceImageId', imageId); // Image ID to replace
      formData.append('caption', `Replaced image for ${alt}`);

      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh the page to show the new image
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error replacing image: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error replacing image:', error);
      alert('Failed to replace image. Please try again.');
    } finally {
      setIsReplacing(null);
      setReplaceFile(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      
      setReplaceFile(file);
    }
  };

  const handleCancelReplace = () => {
    setReplaceFile(null);
    setIsReplacing(null);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].caption || `${alt} ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority={currentIndex === 0}
          unoptimized={images[currentIndex].url.includes('blob.vercel-storage.com')}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Admin Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => handleEditCaption(images[currentIndex].id, images[currentIndex].caption || "")}
            className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            title="Edit caption"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => setIsReplacing(images[currentIndex].id)}
            className="bg-blue-500/80 hover:bg-blue-500 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            title="Replace image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
          
          <button
            onClick={() => handleDeleteImage(images[currentIndex].id)}
            disabled={isDeleting === images[currentIndex].id}
            className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
            title="Delete image"
          >
            {isDeleting === images[currentIndex].id ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex 
                  ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105' 
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.url}
                alt={image.caption || `${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={image.url.includes('blob.vercel-storage.com')}
              />
            </button>
          ))}
        </div>
      )}

      {/* Caption Display/Edit */}
      <div className="mt-3">
        {editingCaption === images[currentIndex].id ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Enter image caption..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={() => handleSaveCaption(images[currentIndex].id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-800 text-sm italic font-medium">
              {images[currentIndex].caption || "No caption"}
            </p>
          </div>
        )}
      </div>

      {/* Replace Image Section */}
      {isReplacing === images[currentIndex].id && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Replace Image</h4>
          <div className="space-y-3">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-600 mt-1">Select a new image to replace the current one (max 5MB)</p>
            </div>
            
            {replaceFile && (
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Selected: <span className="font-medium">{replaceFile.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(replaceFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleReplaceImage(images[currentIndex].id)}
                disabled={!replaceFile || isReplacing === images[currentIndex].id}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReplacing === images[currentIndex].id ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Replacing...</span>
                  </div>
                ) : (
                  'Replace Image'
                )}
              </button>
              <button
                onClick={handleCancelReplace}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
