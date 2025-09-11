"use client";

import { useState, useEffect } from "react";
import Toast from "@/app/components/Toast";

interface SectionImage {
  id: string;
  section: string;
  url: string;
  caption?: string;
  position: number;
}

interface ColorScheme {
  id: string;
  section: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface SectionContent {
  id: string;
  section: string;
  title: string;
  subtitle?: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

interface Facility {
  id: string;
  name: string;
  description?: string;
  facilityType: 'POOL' | 'SPA' | 'GYM' | 'RESTAURANT' | 'BAR' | 'CONFERENCE_ROOM' | 'TENNIS_COURT' | 'GOLF_COURSE' | 'BEACH_ACCESS' | 'PARKING';
  isActive: boolean;
  resortId: string;
  createdAt: string;
  updatedAt: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  position: number;
  isActive: boolean;
}

export default function AdminCustomizationPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'facilities' | 'restaurant' | 'gallery' | 'rooms' | 'activities'>('hero');
  const [sectionImages, setSectionImages] = useState<SectionImage[]>([]);
  const [colorSchemes, setColorSchemes] = useState<ColorScheme[]>([]);
  const [sectionContent, setSectionContent] = useState<SectionContent[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [showAddFeature, setShowAddFeature] = useState(false);

  const sections = {
    hero: {
      name: 'Hero Section',
      description: 'Main banner and welcome area',
      features: ['Background Image', 'Title & Subtitle', 'CTA Buttons', 'Color Scheme']
    },
    features: {
      name: 'Features Section',
      description: 'Key features and benefits showcase',
      features: ['Feature Cards', 'Icons', 'Descriptions', 'Ordering']
    },
    facilities: {
      name: 'Facilities Section',
      description: 'Pool, spa, gym, and amenities',
      features: ['Facility Images', 'Descriptions', 'Icons', 'Layout']
    },
    restaurant: {
      name: 'Restaurant Section',
      description: 'Dining and culinary showcase',
      features: ['Food Gallery', 'Menu Highlights', 'Ambiance Photos', 'Reservation Info']
    },
    gallery: {
      name: 'Gallery Section',
      description: 'Photo galleries and showcases',
      features: ['Image Grid', 'Categories', 'Lightbox', 'Filtering']
    },
    rooms: {
      name: 'Rooms Section',
      description: 'Accommodation showcase',
      features: ['Room Photos', 'Amenities', 'Pricing', 'Availability']
    },
    activities: {
      name: 'Activities Section',
      description: 'Recreation and entertainment',
      features: ['Activity Images', 'Schedules', 'Booking', 'Highlights']
    }
  };

  const defaultColorSchemes: ColorScheme[] = [
    {
      id: 'hero-default',
      section: 'hero',
      primaryColor: '#4F46E5',
      secondaryColor: '#7C3AED',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      id: 'facilities-default',
      section: 'facilities',
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      backgroundColor: '#F9FAFB',
      textColor: '#374151'
    },
    {
      id: 'restaurant-default',
      section: 'restaurant',
      primaryColor: '#EA580C',
      secondaryColor: '#F97316',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      id: 'gallery-default',
      section: 'gallery',
      primaryColor: '#7C3AED',
      secondaryColor: '#A855F7',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      id: 'rooms-default',
      section: 'rooms',
      primaryColor: '#2563EB',
      secondaryColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      id: 'activities-default',
      section: 'activities',
      primaryColor: '#DC2626',
      secondaryColor: '#EF4444',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    }
  ];

  const defaultContent: SectionContent[] = [
    {
      id: 'hero-default',
      section: 'hero',
      title: 'Welcome to Simcate Gardens',
      subtitle: 'Your perfect getaway destination',
      description: 'Experience luxury and comfort in our stunning beachfront resort with world-class amenities and breathtaking ocean views.',
      ctaText: 'Book Your Stay',
      ctaLink: '/rooms'
    },
    {
      id: 'facilities-default',
      section: 'facilities',
      title: 'World-Class Facilities',
      subtitle: 'Everything you need for the perfect stay',
      description: 'From our infinity pool overlooking the ocean to our state-of-the-art spa, every facility is designed for your comfort and enjoyment.',
      ctaText: 'Explore Facilities',
      ctaLink: '/facilities'
    },
    {
      id: 'restaurant-default',
      section: 'restaurant',
      title: 'Ocean Breeze Restaurant',
      subtitle: 'Fine dining with spectacular views',
      description: 'Savor exquisite cuisine prepared by our award-winning chefs while enjoying panoramic ocean views from our elegant dining room.',
      ctaText: 'View Menu',
      ctaLink: '/restaurant'
    },
    {
      id: 'gallery-default',
      section: 'gallery',
      title: 'Photo Gallery',
      subtitle: 'Capturing moments of paradise',
      description: 'Browse through our collection of stunning photos showcasing the beauty of our resort, rooms, facilities, and surrounding landscapes.',
      ctaText: 'View All Photos',
      ctaLink: '/gallery'
    },
    {
      id: 'rooms-default',
      section: 'rooms',
      title: 'Luxurious Accommodations',
      subtitle: 'Comfort meets elegance',
      description: 'Choose from our range of beautifully appointed rooms and suites, each designed to provide the ultimate in comfort and luxury.',
      ctaText: 'View Rooms',
      ctaLink: '/rooms'
    },
    {
      id: 'activities-default',
      section: 'activities',
      title: 'Exciting Activities',
      subtitle: 'Adventure awaits at every turn',
      description: 'From water sports and beach activities to cultural tours and wellness programs, there&apos;s something for everyone to enjoy.',
      ctaText: 'Explore Activities',
      ctaLink: '/activities'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customizationResponse, facilitiesResponse] = await Promise.all([
        fetch('/api/admin/customization'),
        fetch('/api/admin/facilities')
      ]);
      
      if (customizationResponse.ok) {
        const data = await customizationResponse.json();
        setSectionImages(data.sectionImages || []);
        setColorSchemes(data.colorSchemes.length > 0 ? data.colorSchemes : defaultColorSchemes);
        setSectionContent(data.sectionContent.length > 0 ? data.sectionContent : defaultContent);
        setFeatures(data.features || []);
      } else {
        // Fallback to defaults if API fails
        setSectionImages([]);
        setColorSchemes(defaultColorSchemes);
        setSectionContent(defaultContent);
        setFeatures([]);
      }

      if (facilitiesResponse.ok) {
        const facilitiesData = await facilitiesResponse.json();
        setFacilities(facilitiesData.facilities || []);
      } else {
        setFacilities([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to defaults on error
      setSectionImages([]);
      setColorSchemes(defaultColorSchemes);
      setSectionContent(defaultContent);
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setToast({ message: "Please select a file", type: "error" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('section', activeTab);
    formData.append('caption', caption);

    try {
      const response = await fetch('/api/admin/customization/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newImage: SectionImage = {
          id: data.image.id,
          section: data.image.section,
          url: data.image.url,
          caption: data.image.caption || undefined,
          position: data.image.position
        };

        setSectionImages(prev => [...prev, newImage]);
        setToast({ message: "Image uploaded successfully", type: "success" });
        setSelectedFile(null);
        setCaption("");
      } else {
        const error = await response.json();
        setToast({ message: error.error || "Error uploading image", type: "error" });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setToast({ message: 'An error occurred while uploading the image', type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleColorChange = (sectionId: string, field: keyof ColorScheme, value: string) => {
    setColorSchemes(prev => prev.map(scheme => 
      scheme.section === sectionId ? { ...scheme, [field]: value } : scheme
    ));
  };

  const handleContentChange = (sectionId: string, field: keyof SectionContent, value: string) => {
    setSectionContent(prev => prev.map(content => 
      content.section === sectionId ? { ...content, [field]: value } : content
    ));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/admin/customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionContent,
          colorSchemes,
          sectionImages,
        }),
      });

      if (response.ok) {
        setToast({ message: "Changes saved successfully", type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: error.error || "Error saving changes", type: "error" });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setToast({ message: "Error saving changes", type: "error" });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/customization/images?id=${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSectionImages(prev => prev.filter(img => img.id !== imageId));
        setToast({ message: "Image deleted successfully", type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: error.error || "Error deleting image", type: "error" });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setToast({ message: "Error deleting image", type: "error" });
    }
  };

  const handleSaveFacility = async (facility: Partial<Facility>) => {
    try {
      const url = facility.id ? `/api/admin/facilities/${facility.id}` : '/api/admin/facilities';
      const method = facility.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facility),
      });

      if (response.ok) {
        const data = await response.json();
        if (facility.id) {
          setFacilities(prev => prev.map(f => f.id === facility.id ? data.facility : f));
        } else {
          setFacilities(prev => [...prev, data.facility]);
        }
        setEditingFacility(null);
        setShowAddFacility(false);
        setToast({ message: "Facility saved successfully", type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: error.error || "Error saving facility", type: "error" });
      }
    } catch (error) {
      console.error('Error saving facility:', error);
      setToast({ message: "Error saving facility", type: "error" });
    }
  };

  const handleDeleteFacility = async (facilityId: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/facilities/${facilityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFacilities(prev => prev.filter(f => f.id !== facilityId));
        setToast({ message: "Facility deleted successfully", type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: error.error || "Error deleting facility", type: "error" });
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      setToast({ message: "Error deleting facility", type: "error" });
    }
  };

  const handleSaveFeature = async (feature: Partial<Feature>) => {
    try {
      const url = feature.id ? `/api/admin/features/${feature.id}` : '/api/admin/features';
      const method = feature.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feature),
      });

      if (response.ok) {
        const data = await response.json();
        if (feature.id) {
          setFeatures(prev => prev.map(f => f.id === feature.id ? data.feature : f));
          setToast({ message: "Feature updated successfully", type: "success" });
        } else {
          setFeatures(prev => [...prev, data.feature]);
          setToast({ message: "Feature created successfully", type: "success" });
        }
        setEditingFeature(null);
        setShowAddFeature(false);
      } else {
        setToast({ message: "Error saving feature", type: "error" });
      }
    } catch (error) {
      console.error('Error saving feature:', error);
      setToast({ message: "Error saving feature", type: "error" });
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/features/${featureId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFeatures(prev => prev.filter(f => f.id !== featureId));
        setToast({ message: "Feature deleted successfully", type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: error.error || "Error deleting feature", type: "error" });
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      setToast({ message: "Error deleting feature", type: "error" });
    }
  };

  const currentSection = sections[activeTab];
  const currentColorScheme = colorSchemes.find(cs => cs.section === activeTab);
  const currentContent = sectionContent.find(sc => sc.section === activeTab);
  const currentImages = sectionImages.filter(img => img.section === activeTab);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading customization options...</div>
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Site Customization</h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize your website&apos;s appearance and content section by section
            </p>
          </div>
          <button
            onClick={handleSaveChanges}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700"
          >
            Save All Changes
          </button>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as 'hero' | 'features' | 'facilities' | 'restaurant' | 'gallery' | 'rooms' | 'activities')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        <div className="space-y-8">
          {/* Section Header */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{currentSection.name}</h3>
                <p className="text-gray-600 mt-1">{currentSection.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Features:</div>
                <div className="text-sm text-gray-700">
                  {currentSection.features.join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Content</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={currentContent?.title || ''}
                  onChange={(e) => handleContentChange(activeTab, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={currentContent?.subtitle || ''}
                  onChange={(e) => handleContentChange(activeTab, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={currentContent?.description || ''}
                  onChange={(e) => handleContentChange(activeTab, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={currentContent?.ctaText || ''}
                  onChange={(e) => handleContentChange(activeTab, 'ctaText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={currentContent?.ctaLink || ''}
                  onChange={(e) => handleContentChange(activeTab, 'ctaLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentColorScheme?.primaryColor || '#000000'}
                    onChange={(e) => handleColorChange(activeTab, 'primaryColor', e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={currentColorScheme?.primaryColor || ''}
                    onChange={(e) => handleColorChange(activeTab, 'primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentColorScheme?.secondaryColor || '#000000'}
                    onChange={(e) => handleColorChange(activeTab, 'secondaryColor', e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={currentColorScheme?.secondaryColor || ''}
                    onChange={(e) => handleColorChange(activeTab, 'secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentColorScheme?.backgroundColor || '#000000'}
                    onChange={(e) => handleColorChange(activeTab, 'backgroundColor', e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={currentColorScheme?.backgroundColor || ''}
                    onChange={(e) => handleColorChange(activeTab, 'backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentColorScheme?.textColor || '#000000'}
                    onChange={(e) => handleColorChange(activeTab, 'textColor', e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={currentColorScheme?.textColor || ''}
                    onChange={(e) => handleColorChange(activeTab, 'textColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            {currentColorScheme && (
              <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: currentColorScheme.backgroundColor }}>
                <h5 className="font-medium mb-3" style={{ color: currentColorScheme.textColor }}>
                  Color Preview
                </h5>
                <div className="space-y-2">
                  <div 
                    className="px-4 py-2 rounded text-sm font-medium"
                    style={{ backgroundColor: currentColorScheme.primaryColor, color: '#FFFFFF' }}
                  >
                    Primary Button
                  </div>
                  <div 
                    className="px-4 py-2 rounded text-sm font-medium border"
                    style={{ backgroundColor: currentColorScheme.secondaryColor, color: '#FFFFFF' }}
                  >
                    Secondary Button
                  </div>
                  <p style={{ color: currentColorScheme.textColor }}>
                    Sample text with the selected text color
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Image Management */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Images</h4>
            
            {/* Upload Section */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-3">Upload New Image</h5>
              <div className="grid md:grid-cols-2 gap-4">
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

              <div className="mt-4">
                <button
                  onClick={handleImageUpload}
                  disabled={uploading || !selectedFile}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>

            {/* Images Grid */}
            {currentImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentImages.map((image) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={image.url}
                        alt={image.caption || "Section image"}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          Position: {image.position}
                        </span>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                      {image.caption && (
                        <p className="text-sm text-gray-600">{image.caption}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-gray-500 mb-2">No images uploaded for this section</div>
                <p className="text-sm text-gray-400">Upload images using the form above</p>
              </div>
            )}
          </div>

          {/* Feature Management - Only show for features section */}
          {activeTab === 'features' && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900">Feature Management</h4>
                <button
                  onClick={() => setShowAddFeature(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
                >
                  Add New Feature
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature) => (
                  <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{feature.title}</h5>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          feature.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {feature.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingFeature(feature)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFeature(feature.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Position: <span className="font-medium">{feature.position}</span>
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">{feature.description}</p>
                    {feature.icon && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-400">Icon: {feature.icon.substring(0, 30)}...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facility Management - Only show for facilities section */}
          {activeTab === 'facilities' && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900">Facility Management</h4>
                <button
                  onClick={() => setShowAddFacility(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
                >
                  Add New Facility
                </button>
              </div>

              {/* Facilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.map((facility) => (
                  <div key={facility.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{facility.name}</h5>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          facility.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {facility.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingFacility(facility)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFacility(facility.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Type: <span className="font-medium">{facility.facilityType.replace('_', ' ')}</span>
                    </p>
                    {facility.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{facility.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {facilities.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-gray-500 mb-2">No facilities found</div>
                  <p className="text-sm text-gray-400">Add your first facility to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Facility Edit Modal */}
      {editingFacility && (
        <FacilityEditModal
          facility={editingFacility}
          onSave={handleSaveFacility}
          onClose={() => setEditingFacility(null)}
        />
      )}

      {/* Add Facility Modal */}
      {showAddFacility && (
        <FacilityEditModal
          facility={null}
          onSave={handleSaveFacility}
          onClose={() => setShowAddFacility(false)}
        />
      )}

      {/* Feature Edit Modal */}
      {editingFeature && (
        <FeatureEditModal
          feature={editingFeature}
          onSave={handleSaveFeature}
          onClose={() => setEditingFeature(null)}
        />
      )}

      {/* Add Feature Modal */}
      {showAddFeature && (
        <FeatureEditModal
          feature={null}
          onSave={handleSaveFeature}
          onClose={() => setShowAddFeature(false)}
        />
      )}
    </>
  );
}

// Facility Edit Modal Component
function FacilityEditModal({ 
  facility, 
  onSave, 
  onClose 
}: { 
  facility: Facility | null; 
  onSave: (facility: Partial<Facility>) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: facility?.name || '',
    description: facility?.description || '',
    facilityType: facility?.facilityType || 'POOL' as const,
    isActive: facility?.isActive ?? true,
  });

  const facilityTypes = [
    'POOL', 'SPA', 'GYM', 'RESTAURANT', 'BAR', 'CONFERENCE_ROOM', 
    'TENNIS_COURT', 'GOLF_COURSE', 'BEACH_ACCESS', 'PARKING'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(facility && { id: facility.id }),
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {facility ? 'Edit Facility' : 'Add New Facility'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility Type
            </label>
            <select
              value={formData.facilityType}
              onChange={(e) => setFormData(prev => ({ ...prev, facilityType: e.target.value as 'POOL' | 'SPA' | 'GYM' | 'RESTAURANT' | 'BAR' | 'CONFERENCE_ROOM' | 'TENNIS_COURT' | 'GOLF_COURSE' | 'BEACH_ACCESS' | 'PARKING' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {facilityTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {facility ? 'Update' : 'Create'} Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Feature Edit Modal Component
function FeatureEditModal({ 
  feature, 
  onSave, 
  onClose 
}: { 
  feature: Feature | null;
  onSave: (feature: Partial<Feature>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: feature?.title || '',
    description: feature?.description || '',
    icon: feature?.icon || '',
    position: feature?.position || 0,
    isActive: feature?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(feature && { id: feature.id }),
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {feature ? 'Edit Feature' : 'Add New Feature'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon (SVG Path)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the SVG path data for the icon (without the path element)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {feature ? 'Update' : 'Create'} Feature
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
