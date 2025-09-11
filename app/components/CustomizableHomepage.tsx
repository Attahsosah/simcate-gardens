"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ImageCarousel from "./ImageCarousel";

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

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  position: number;
  isActive: boolean;
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

interface Room {
  id: string;
  name: string;
  description: string;
  roomType: string;
  capacity: number;
  price: number;
  previewImageUrl?: string;
  amenities: Array<{
    amenity: string;
  }>;
}

interface ResortImage {
  id: string;
  url: string;
  caption?: string;
  resortId: string;
  createdAt: string;
}

interface RestaurantFeature {
  title: string;
  description: string;
  icon: string;
}

interface RestaurantDetail {
  title: string;
  subtitle: string;
  icon: string;
}

interface RestaurantCustomization {
  features: RestaurantFeature[];
  details: RestaurantDetail[];
  content: {
    title: string;
    subtitle: string;
  };
}

interface CustomizableHomepageProps {
  facilities: Facility[];
  rooms: Room[];
  resortImages: ResortImage[];
}

export default function CustomizableHomepage({ facilities, rooms, resortImages }: CustomizableHomepageProps) {
  const { data: session } = useSession();
  const [customizationData, setCustomizationData] = useState<{
    sectionContent: SectionContent[];
    colorSchemes: ColorScheme[];
    sectionImages: SectionImage[];
    features: Feature[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [restaurantImages, setRestaurantImages] = useState<SectionImage[]>([]);
  const [restaurantCustomization, setRestaurantCustomization] = useState<RestaurantCustomization | null>(null);

  useEffect(() => {
    fetchCustomizationData();
    fetchRestaurantCustomization();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserRole();
    }
  }, [session]);

  const fetchCustomizationData = async () => {
    try {
      const response = await fetch('/api/customization');
      if (response.ok) {
        const data = await response.json();
        setCustomizationData(data);
        
        // Filter restaurant images
        const restaurantImgs = data.sectionImages?.filter((img: SectionImage) => img.section === 'restaurant') || [];
        setRestaurantImages(restaurantImgs);
      }
    } catch (error) {
      console.error('Error fetching customization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/user/role');
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchRestaurantCustomization = async () => {
    try {
      const response = await fetch('/api/admin/restaurant');
      if (response.ok) {
        const data = await response.json();
        setRestaurantCustomization(data);
      } else if (response.status === 401) {
        // User not authenticated, that's okay
        console.log('User not authenticated for restaurant customization');
      } else if (response.status === 403) {
        // User not admin, that's okay
        console.log('User not admin, restaurant customization not available');
      } else {
        // Other error
        console.log('Restaurant customization API error:', response.status);
      }
    } catch (error) {
      // Silently handle the error since this is optional
      console.log('Restaurant customization not available');
    }
  };

  const getSectionContent = (section: string) => {
    if (!customizationData) return null;
    return customizationData.sectionContent.find(sc => sc.section === section);
  };

  const getColorScheme = (section: string) => {
    if (!customizationData) return null;
    return customizationData.colorSchemes.find(cs => cs.section === section);
  };

  const getSectionImages = (section: string) => {
    if (!customizationData) return [];
    const images = customizationData.sectionImages.filter(img => img.section === section);
    // Sort to prioritize real uploaded images over placeholder images
    return images.sort((a, b) => {
      const aIsPlaceholder = a.url.includes('/api/placeholder-image');
      const bIsPlaceholder = b.url.includes('/api/placeholder-image');
      if (aIsPlaceholder && !bIsPlaceholder) return 1;
      if (!aIsPlaceholder && bIsPlaceholder) return -1;
      return a.position - b.position;
    });
  };

  const getGradientForFeature = (title: string): string => {
    const gradients: { [key: string]: string } = {
      "Fresh Seafood": "from-yellow-400 to-orange-500",
      "Local Ingredients": "from-green-400 to-emerald-500",
      "Sunset Dining": "from-purple-400 to-pink-500",
      "Signature Dishes": "from-blue-400 to-indigo-500"
    };
    return gradients[title] || "from-gray-400 to-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const heroContent = getSectionContent('hero') || {
    title: 'Welcome to Simcate Gardens',
    subtitle: 'Your tropical paradise awaits with pristine beaches, luxury accommodations, and world-class facilities',
    ctaText: 'Explore Our Resort',
    ctaLink: '/resort'
  };

  const heroColors = getColorScheme('hero') || {
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED'
  };

  const facilitiesContent = getSectionContent('facilities') || {
    title: 'Our World-Class Facilities',
    subtitle: 'Discover the exceptional amenities that make Simcate Gardens the perfect destination for your dream vacation'
  };

  const facilitiesColors = getColorScheme('facilities') || {
    primaryColor: '#059669',
    secondaryColor: '#10B981'
  };

  const restaurantContent = restaurantCustomization?.content || getSectionContent('restaurant') || {
    title: 'Culinary Excellence at Ocean Breeze Restaurant',
    subtitle: 'Experience world-class dining with fresh local ingredients, innovative cuisine, and breathtaking ocean views'
  };

  const restaurantColors = getColorScheme('restaurant') || {
    primaryColor: '#EA580C',
    secondaryColor: '#F97316'
  };

  const roomsContent = getSectionContent('rooms') || {
    title: 'Luxury Accommodations',
    subtitle: 'Experience comfort and elegance in our carefully designed rooms, each offering unique amenities and stunning views'
  };

  const roomsColors = getColorScheme('rooms') || {
    primaryColor: '#2563EB',
    secondaryColor: '#3B82F6'
  };

  const galleryContent = getSectionContent('gallery') || {
    title: 'Photo Gallery',
    subtitle: 'Capturing moments of paradise',
    description: 'Browse through our collection of stunning photos showcasing the beauty of our resort, rooms, facilities, and surrounding landscapes.'
  };

  const galleryColors = getColorScheme('gallery') || {
    primaryColor: '#7C3AED',
    secondaryColor: '#A855F7'
  };

  // Get section images
  const heroImages = getSectionImages('hero');
  const facilitiesImages = getSectionImages('facilities');
  
  // Find restaurant facility to use its image
  const restaurantFacility = facilities.find(f => f.facilityType === 'RESTAURANT');
  const roomsImages = getSectionImages('rooms');
  const galleryImages = getSectionImages('gallery');

  return (
    <div className="relative bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div 
        className="text-white relative overflow-hidden"
        style={{ 
          background: heroImages.length > 0 && !heroImages[0].url.includes('/api/placeholder-image')
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${heroImages[0].url}) center/cover`
            : `linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              {heroContent.title}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {heroContent.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
              <Link
                href={heroContent.ctaLink || "/resort"}
                className="btn-primary text-lg px-10 py-4 shadow-2xl"
              >
                {heroContent.ctaText || "Explore Our Resort"}
              </Link>
              <Link
                href="/rooms"
                className="btn-secondary text-lg px-10 py-4 border-2 border-white/30 text-white hover:bg-white/10"
              >
                View Rooms
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {customizationData?.features && customizationData.features.length > 0 && (
      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
            {customizationData.features.map((feature, index) => (
              <div key={feature.id} className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
              </svg>
            </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
          </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* Restaurant Section */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {restaurantContent.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {restaurantContent.subtitle}
            </p>
          </div>

          {/* Restaurant Section - New Simple Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Side - Main Restaurant Image */}
            <div className="order-2 lg:order-1">
              <ImageCarousel
                images={restaurantImages}
                fallbackImages={[
                  ...(restaurantFacility?.imageUrl ? [{
                    id: 'facility-image',
                    url: restaurantFacility.imageUrl,
                    caption: restaurantFacility.name || "Restaurant",
                    alt: restaurantFacility.name || "Restaurant"
                  }] : []),
                  ...resortImages.map(img => ({
                    id: img.id,
                    url: img.url,
                    caption: img.caption || "Resort View",
                    alt: img.caption || "Resort View"
                  }))
                ]}
                className="card-modern"
                autoPlay={true}
                autoPlayInterval={6000}
                showDots={true}
                showArrows={true}
              />
            </div>

            {/* Right Side - Restaurant Information */}
            <div className="order-1 lg:order-2 space-y-8">
              {/* Restaurant Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  const featuresToShow = restaurantCustomization?.features && restaurantCustomization.features.length > 0 
                    ? restaurantCustomization.features.map((feature: RestaurantFeature) => ({
                        ...feature,
                        gradient: getGradientForFeature(feature.title)
                      }))
                    : [
                      { 
                        gradient: "from-yellow-400 to-orange-500", 
                        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", 
                        title: "Fresh Seafood",
                        description: "Daily catch from local waters"
                      },
                      { 
                        gradient: "from-green-400 to-emerald-500", 
                        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", 
                        title: "Local Ingredients",
                        description: "Farm-to-table freshness"
                      },
                      { 
                        gradient: "from-purple-400 to-pink-500", 
                        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", 
                        title: "Sunset Dining",
                        description: "Breathtaking ocean views"
                      },
                      { 
                        gradient: "from-blue-400 to-indigo-500", 
                        icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", 
                        title: "Signature Dishes",
                        description: "Chef&apos;s special creations"
                      },
                    ];
                  
                  return featuresToShow.map((feature, index) => (
                    <div key={index} className="group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className={`relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br ${feature.gradient} group-hover:scale-105 transition-all duration-300 card-modern`}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                          <div className="w-12 h-12 mb-3 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                            </svg>
                          </div>
                          <h4 className="text-sm font-bold mb-1 text-center">{feature.title}</h4>
                          <p className="text-xs opacity-90 text-center leading-tight">{feature.description}</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Restaurant Details */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">Restaurant Details</h3>
                <div className="space-y-4">
                  {(() => {
                    const detailsToShow = restaurantCustomization?.details && restaurantCustomization.details.length > 0 
                      ? restaurantCustomization.details
                      : [
                        { title: "Breakfast & Dinner Service", subtitle: "7:00 AM - 10:00 PM", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                        { title: "Ocean View Seating", subtitle: "Panoramic Pacific views", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                        { title: "Reservations Available", subtitle: "Book your perfect table", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                      ];
                    
                    return detailsToShow.map((detail, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={detail.icon} />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{detail.title}</h4>
                          <p className="text-gray-300 text-sm">{detail.subtitle}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group animate-slide-up">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Breakfast & Dinner</h3>
              <p className="text-gray-300 leading-relaxed">Start your day with our continental breakfast and end it with an elegant dinner</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Ocean View Seating</h3>
              <p className="text-gray-300 leading-relaxed">Enjoy your meal with stunning panoramic views of the Pacific Ocean</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Reservations Available</h3>
              <p className="text-gray-300 leading-relaxed">Book your table in advance to ensure the perfect dining experience</p>
            </div>
          </div>

          {/* Restaurant CTA */}
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Fine Dining?</h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Book your table at Ocean Breeze Restaurant and enjoy an unforgettable culinary experience with breathtaking ocean views.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resort"
                className="btn-primary text-lg px-10 py-4 shadow-2xl"
            >
              View Restaurant Details
            </Link>
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin/restaurant"
                  className="btn-secondary text-lg px-10 py-4"
                >
                  Customize Restaurant
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Gallery Section */}
      <div 
        className="py-16"
        style={{ backgroundColor: galleryColors.backgroundColor || '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {galleryContent.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {galleryContent.subtitle}
            </p>
          </div>

          {/* Gallery Grid */}
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {galleryImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <p className="text-white text-sm font-medium">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No gallery images available yet</p>
            </div>
          )}

          {/* Gallery CTA */}
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-block text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              style={{ 
                backgroundColor: galleryColors.primaryColor,
                ':hover': { backgroundColor: galleryColors.secondaryColor }
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = galleryColors.secondaryColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = galleryColors.primaryColor}
            >
              View All Photos
            </Link>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {facilitiesContent.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {facilitiesContent.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div key={facility.id} className="card-modern overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {facility.imageUrl ? (
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={facility.imageUrl}
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white drop-shadow-lg">{facility.name}</h3>
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white border border-white/30">
                        {facility.facilityType}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center group-hover:from-indigo-600 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">
                  <div className="text-white text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        {facility.facilityType === 'POOL' && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                      )}
                        {facility.facilityType === 'RESTAURANT' && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
                        </svg>
                      )}
                        {facility.facilityType === 'SPA' && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                        {facility.facilityType === 'GYM' && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                        {facility.facilityType === 'BEACH_ACCESS' && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                        {facility.facilityType === 'PARKING' && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      )}
                        {facility.facilityType === 'BAR' && (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        {facility.facilityType === 'CONFERENCE_ROOM' && (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                        {facility.facilityType === 'TENNIS_COURT' && (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                        {facility.facilityType === 'GOLF_COURSE' && (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold">{facility.name}</h3>
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {facility.facilityType}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{facility.name}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{facility.description}</p>
                  <Link
                    href={`/facilities/${facility.id}`}
                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium group transition-colors duration-300"
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/resort"
              className="btn-primary text-lg px-10 py-4 shadow-2xl"
            >
              View All Facilities
            </Link>
          </div>
        </div>
      </div>


      

      {/* Rooms Section */}
      <div 
        className="py-16"

        style={{ backgroundColor: roomsColors.backgroundColor || '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: roomsColors.textColor || '#1F2937' }}
            >
              {roomsContent.title}
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto"
              style={{ color: roomsColors.textColor || '#6B7280' }}
            >
              {roomsContent.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 relative">
                  {room.previewImageUrl ? (
                    <img
                      src={room.previewImageUrl}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : room.roomImages && room.roomImages.length > 0 ? (
                    <img
                      src={room.roomImages[0].url}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                          {room.roomType}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <span className="text-white font-semibold">${room.price.toFixed(0)}/night</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      Up to {room.capacity} guests
                    </span>
                    <span className="text-lg font-semibold text-indigo-600">
                      ${room.price.toFixed(2)}
                    </span>
                  </div>

                  {room.amenities.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenityItem) => (
                          <span
                            key={amenityItem.id}
                            className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                          >
                            {amenityItem.amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-900">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/rooms/${room.id}`}
                    className="inline-block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/rooms"
              className="inline-block text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: roomsColors.primaryColor }}
              onMouseEnter={(e) => e.target.style.backgroundColor = roomsColors.secondaryColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = roomsColors.primaryColor}
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="text-white py-16"
        style={{ 
          background: `linear-gradient(to right, ${heroColors.primaryColor}, ${heroColors.secondaryColor})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Dream Vacation?
          </h2>
          <p className="text-xl mb-8 text-indigo-200 max-w-3xl mx-auto">
            Book your stay at Simcate Gardens and experience luxury, comfort, and unforgettable memories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resort"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Booking
            </Link>
            {!session && (
              <Link
                href="/signup"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

