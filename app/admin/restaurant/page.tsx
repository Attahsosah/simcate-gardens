// app/admin/restaurant/page.tsx


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "../../components/ImageUpload";

interface RestaurantContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface RestaurantFeature {
  id?: string;
  title: string;
  description: string;
  icon: string;
}

interface RestaurantImage {
  id: string;
  url: string;
  caption?: string;
}

interface RestaurantDetail {
  id?: string;
  title: string;
  subtitle: string;
  icon: string;
}

export default function RestaurantCustomizationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<RestaurantImage[]>([]);
  const [details, setDetails] = useState<RestaurantDetail[]>([]);
  
  const [content, setContent] = useState<RestaurantContent>({
    title: "Ocean Breeze Restaurant",
    subtitle: "Fine Dining with Ocean Views",
    description: "Experience culinary excellence with breathtaking ocean views at our signature restaurant.",
    ctaText: "View Restaurant Details",
    ctaLink: "/resort"
  });

  const [features, setFeatures] = useState<RestaurantFeature[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/signin");
      return;
    }

    fetchRestaurantData();
  }, [session, status, router]);

  const fetchRestaurantData = async () => {
    try {
      const [restaurantResponse, imagesResponse] = await Promise.all([
        fetch("/api/admin/restaurant"),
        fetch("/api/admin/restaurant/images")
      ]);

      if (restaurantResponse.ok) {
        const data = await restaurantResponse.json();
        if (data.content) {
          setContent(data.content);
        }
        if (data.features && data.features.length > 0) {
          setFeatures(data.features);
        } else {
          // Set default features if none exist in database
          setFeatures([
            {
              title: "Fresh Seafood",
              description: "Daily catch from local waters",
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            },
            {
              title: "Local Ingredients",
              description: "Farm-to-table freshness",
              icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            },
            {
              title: "Sunset Dining",
              description: "Breathtaking ocean views",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            },
            {
              title: "Signature Dishes",
              description: "Chef&apos;s special creations",
              icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            }
          ]);
        }
        if (data.details && data.details.length > 0) {
          setDetails(data.details);
        } else {
          // Set default details if none exist in database
          setDetails([
            {
              title: "Breakfast & Dinner Service",
              subtitle: "7:00 AM - 10:00 PM",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            },
            {
              title: "Ocean View Seating",
              subtitle: "Panoramic Pacific views",
              icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            },
            {
              title: "Reservations Available",
              subtitle: "Book your perfect table",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          ]);
        }
      }

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        if (imagesData.images && imagesData.images.length > 0) {
          setImages(imagesData.images);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, features, details })
      });

      if (response.ok) {
        toast.success("Restaurant customization saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving restaurant data:", error);
      toast.error("Failed to save restaurant customization");
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (index: number, field: keyof RestaurantFeature, value: string) => {
    setFeatures(prev => prev.map((feature, i) => 
      i === index ? { ...feature, [field]: value } : feature
    ));
  };

  const addFeature = () => {
    setFeatures(prev => [...prev, {
      title: "New Feature",
      description: "Feature description",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const updateDetail = (index: number, field: keyof RestaurantDetail, value: string) => {
    setDetails(prev => prev.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    ));
  };

  const addDetail = () => {
    setDetails(prev => [...prev, {
      title: "New Detail",
      subtitle: "Detail description",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    }]);
  };

  const removeDetail = (index: number) => {
    setDetails(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUploaded = (newImage: RestaurantImage) => {
    setImages(prev => [...prev, newImage]);
  };

  const handleImageRemoved = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Restaurant Customization</h1>
          <p className="text-gray-300">Customize the restaurant section content and features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Section */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Restaurant Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={content.subtitle}
                  onChange={(e) => setContent(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={content.description}
                  onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CTA Text
                </label>
                <input
                  type="text"
                  value={content.ctaText}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaText: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CTA Link
                </label>
                <input
                  type="text"
                  value={content.ctaLink}
                  onChange={(e) => setContent(prev => ({ ...prev, ctaLink: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Restaurant Images</h2>
            <ImageUpload
              section="restaurant"
              onImageUploaded={handleImageUploaded}
              onImageRemoved={handleImageRemoved}
              existingImages={images}
              maxImages={10}
            />
          </div>

          {/* Features Section */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Restaurant Features</h2>
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Feature
              </button>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-medium">Feature {index + 1}</h3>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Details Section */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Restaurant Details</h2>
              <button
                onClick={addDetail}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Detail
              </button>
            </div>

            <div className="space-y-4">
              {details.map((detail, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-medium">Detail {index + 1}</h3>
                    <button
                      onClick={() => removeDetail(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={detail.title}
                        onChange={(e) => updateDetail(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={detail.subtitle}
                        onChange={(e) => updateDetail(index, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Icon (SVG Path)
                      </label>
                      <input
                        type="text"
                        value={detail.icon}
                        onChange={(e) => updateDetail(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
