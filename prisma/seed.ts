import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminHashedPassword = await bcrypt.hash('password123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test Admin',
      hashedPassword: adminHashedPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userHashedPassword = await bcrypt.hash('user123', 12);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      hashedPassword: userHashedPassword,
      role: 'USER',
    },
  });

  // Create the resort
  const resort = await prisma.resort.upsert({
    where: { id: 'resort-1' },
    update: {},
    create: {
      id: 'resort-1',
      name: 'Paradise Beach Resort & Spa',
      description: 'A luxurious beachfront resort offering the perfect blend of relaxation and adventure. Enjoy pristine beaches, world-class dining, and exceptional service in a tropical paradise.',
      address: '123 Paradise Beach Road, Maui, Hawaii',
      phone: '+1 (808) 555-0123',
      email: 'info@paradisebeachresort.com',
      website: 'https://paradisebeachresort.com',
    },
  });

  // Create resort facilities
  const facilities = await Promise.all([
    prisma.facility.upsert({
      where: { id: 'facility-1' },
      update: {},
      create: {
        id: 'facility-1',
        name: 'Infinity Pool',
        description: 'Stunning infinity pool overlooking the ocean with swim-up bar',
        facilityType: 'POOL',
        resortId: resort.id,
      },
    }),
    prisma.facility.upsert({
      where: { id: 'facility-2' },
      update: {},
      create: {
        id: 'facility-2',
        name: 'Ocean View Restaurant',
        description: 'Fine dining restaurant serving fresh local cuisine with ocean views',
        facilityType: 'RESTAURANT',
        resortId: resort.id,
      },
    }),
    prisma.facility.upsert({
      where: { id: 'facility-3' },
      update: {},
      create: {
        id: 'facility-3',
        name: 'Tropical Spa',
        description: 'Full-service spa offering massages, facials, and wellness treatments',
        facilityType: 'SPA',
        resortId: resort.id,
      },
    }),
    prisma.facility.upsert({
      where: { id: 'facility-4' },
      update: {},
      create: {
        id: 'facility-4',
        name: 'Fitness Center',
        description: 'Modern gym with cardio equipment, weights, and personal training',
        facilityType: 'GYM',
        resortId: resort.id,
      },
    }),
  ]);

  // Define amenities
  const amenities = ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Balcony', 'Ocean View'];

  // Create resort rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { id: 'room-1' },
      update: {},
      create: {
        id: 'room-1',
        resortId: resort.id,
        name: 'Ocean View Deluxe',
        description: 'Spacious room with king bed and stunning ocean views from private balcony',
        price: 350, // $350
        capacity: 2,
        roomType: 'DELUXE',
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-2' },
      update: {},
      create: {
        id: 'room-2',
        resortId: resort.id,
        name: 'Beachfront Suite',
        description: 'Luxury suite with separate living area and direct beach access',
        price: 550, // $550
        capacity: 4,
        roomType: 'SUITE',
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-3' },
      update: {},
      create: {
        id: 'room-3',
        resortId: resort.id,
        name: 'Garden Villa',
        description: 'Private villa surrounded by tropical gardens with plunge pool',
        price: 750, // $750
        capacity: 6,
        roomType: 'VILLA',
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-4' },
      update: {},
      create: {
        id: 'room-4',
        resortId: resort.id,
        name: 'Standard Room',
        description: 'Comfortable room with all essential amenities',
        price: 250, // $250
        capacity: 2,
        roomType: 'STANDARD',
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-5' },
      update: {},
      create: {
        id: 'room-5',
        resortId: resort.id,
        name: 'Family Suite',
        description: 'Large suite perfect for families with connecting rooms',
        price: 650, // $650
        capacity: 6,
        roomType: 'SUITE',
      },
    }),
  ]);

  // Add amenities to rooms
  await Promise.all([
    // WiFi to all rooms
    ...rooms.map(room => 
      prisma.roomAmenity.upsert({
        where: { roomId_amenity: { roomId: room.id, amenity: amenities[0] } },
        update: {},
        create: { roomId: room.id, amenity: amenities[0] },
      })
    ),
    // Air Conditioning to all rooms
    ...rooms.map(room => 
      prisma.roomAmenity.upsert({
        where: { roomId_amenity: { roomId: room.id, amenity: amenities[1] } },
        update: {},
        create: { roomId: room.id, amenity: amenities[1] },
      })
    ),
    // TV to all rooms
    ...rooms.map(room => 
      prisma.roomAmenity.upsert({
        where: { roomId_amenity: { roomId: room.id, amenity: amenities[2] } },
        update: {},
        create: { roomId: room.id, amenity: amenities[2] },
      })
    ),
    // Ocean View to specific rooms
    prisma.roomAmenity.upsert({
      where: { roomId_amenity: { roomId: rooms[0].id, amenity: amenities[5] } },
      update: {},
      create: { roomId: rooms[0].id, amenity: amenities[5] },
    }),
    prisma.roomAmenity.upsert({
      where: { roomId_amenity: { roomId: rooms[1].id, amenity: amenities[5] } },
      update: {},
      create: { roomId: rooms[1].id, amenity: amenities[5] },
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log('Admin user: test@example.com / password123');
  console.log('Regular user: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
