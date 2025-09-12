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
      }
    ]
  };
}

export default async function Home() {
  try {
    // Use direct images for now since database is not available
    console.log('Using direct image loading...');
    const directImages = getImagesDirectly();
    return <CustomizableHomepage 
      facilities={directImages.facilities} 
      rooms={directImages.rooms} 
      resortImages={directImages.resortImages} 
    />;
  } catch (error) {
    console.error('Error loading images:', error);
    // Return with empty data if there's an error
    return <CustomizableHomepage facilities={[]} rooms={[]} resortImages={[]} />;
  }
}
