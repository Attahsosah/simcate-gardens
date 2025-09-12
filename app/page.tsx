import CustomizableHomepage from "@/app/components/CustomizableHomepage";
import prisma from "@/lib/prisma";

function getImagesDirectly() {
  // This will be populated with actual images from the uploads folder
  return {
    facilities: [
      {
        id: 'facility-1',
        name: 'Infinity Pool',
        description: 'A beautiful infinity pool overlooking the ocean',
        facilityType: 'POOL' as const,
        isActive: true,
        imageUrl: '/uploads/facility_facility-4_1757091704209.jpg',
        resortId: 'resort-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'facility-2',
        name: 'Fine Dining Restaurant',
        description: 'Elegant dining with ocean views',
        facilityType: 'RESTAURANT' as const,
        isActive: true,
        imageUrl: '/uploads/section_restaurant_1757092177054.jpg',
        resortId: 'resort-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    rooms: [
      {
        id: 'room-1',
        name: 'Ocean View Suite',
        description: 'A luxurious suite with stunning ocean views',
        roomType: 'DELUXE',
        capacity: 2,
        price: 299.99,
        previewImageUrl: '/uploads/room_cmenkzk2s0005s1e17zwz5qto_1756070531906.jpg',
        amenities: [
          { amenity: 'WiFi' },
          { amenity: 'Air Conditioning' },
          { amenity: 'Ocean View' }
        ],
        roomImages: [
          {
            id: 'room-img-1',
            url: '/uploads/room_cmenkzk2s0005s1e17zwz5qto_1756070531906.jpg',
            caption: 'Ocean View Suite - Main View'
          }
        ],
        resort: {
          name: 'Paradise Beach Resort & Spa'
        }
      },
      {
        id: 'room-2',
        name: 'Garden Villa',
        description: 'A peaceful villa surrounded by tropical gardens',
        roomType: 'VILLA',
        capacity: 4,
        price: 399.99,
        previewImageUrl: '/uploads/room_room-2_1757559742211.jpg',
        amenities: [
          { amenity: 'WiFi' },
          { amenity: 'Air Conditioning' },
          { amenity: 'Garden View' }
        ],
        roomImages: [
          {
            id: 'room-img-2',
            url: '/uploads/room_room-2_1757559742211.jpg',
            caption: 'Garden Villa - Exterior'
          }
        ],
        resort: {
          name: 'Paradise Beach Resort & Spa'
        }
      }
    ],
    resortImages: [
      {
        id: 'resort-img-1',
        url: '/uploads/resort_resort-1_1756070466330.jpg',
        caption: 'Paradise Beach Resort & Spa - Main View',
        resortId: 'resort-1',
        createdAt: new Date()
      },
      {
        id: 'resort-img-2',
        url: '/uploads/section_hero_1757227442813.jpg',
        caption: 'Resort Hero Section',
        resortId: 'resort-1',
        createdAt: new Date()
      },
      {
        id: 'resort-img-3',
        url: '/uploads/section_gallery_1757092011231.jpg',
        caption: 'Resort Gallery',
        resortId: 'resort-1',
        createdAt: new Date()
      }
    ]
  };
}

export default async function Home() {
  try {
    // First try to get data from database if available
    if (process.env.DATABASE_URL) {
      console.log('Attempting to load from database...');
      const facilities = await prisma.facility.findMany({
        where: { isActive: true },
        include: { resort: true }
      });
      
      const rooms = await prisma.room.findMany({
        include: { 
          roomImages: true,
          resort: true,
          amenities: true
        }
      });
      
      const resortImages = await prisma.resortImage.findMany();
      
      if (facilities.length > 0 || rooms.length > 0) {
        console.log('Successfully loaded from database');
        return <CustomizableHomepage 
          facilities={facilities} 
          rooms={rooms} 
          resortImages={resortImages} 
        />;
      }
    }
    
    // Fallback to direct images if database is not available or empty
    console.log('Using direct image loading fallback...');
    const directImages = getImagesDirectly();
    return <CustomizableHomepage 
      facilities={directImages.facilities} 
      rooms={directImages.rooms} 
      resortImages={directImages.resortImages} 
    />;
  } catch (error) {
    console.error('Error loading images:', error);
    // Final fallback to direct images even if there's an error
    console.log('Using direct image loading due to error...');
    const directImages = getImagesDirectly();
    return <CustomizableHomepage 
      facilities={directImages.facilities} 
      rooms={directImages.rooms} 
      resortImages={directImages.resortImages} 
    />;
  }
}
