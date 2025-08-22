import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create sample hotels
  const hotels = await Promise.all([
    prisma.hotel.upsert({
      where: { id: 'hotel-1' },
      update: {},
      create: {
        id: 'hotel-1',
        name: 'Grand Plaza Hotel',
        description: 'Luxury hotel in the heart of downtown with stunning city views and world-class amenities.',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
        ownerId: user.id,
      },
    }),
    prisma.hotel.upsert({
      where: { id: 'hotel-2' },
      update: {},
      create: {
        id: 'hotel-2',
        name: 'Seaside Resort & Spa',
        description: 'Beachfront resort offering relaxation and adventure with private beach access.',
        address: '456 Ocean Drive',
        city: 'Miami',
        country: 'USA',
        ownerId: user.id,
      },
    }),
    prisma.hotel.upsert({
      where: { id: 'hotel-3' },
      update: {},
      create: {
        id: 'hotel-3',
        name: 'Mountain View Lodge',
        description: 'Cozy mountain retreat with panoramic views and outdoor activities.',
        address: '789 Mountain Road',
        city: 'Denver',
        country: 'USA',
        ownerId: user.id,
      },
    }),
  ]);

  // Create amenities
  const amenities = await Promise.all([
    prisma.amenity.upsert({
      where: { name: 'WiFi' },
      update: {},
      create: { name: 'WiFi' },
    }),
    prisma.amenity.upsert({
      where: { name: 'Air Conditioning' },
      update: {},
      create: { name: 'Air Conditioning' },
    }),
    prisma.amenity.upsert({
      where: { name: 'TV' },
      update: {},
      create: { name: 'TV' },
    }),
    prisma.amenity.upsert({
      where: { name: 'Mini Bar' },
      update: {},
      create: { name: 'Mini Bar' },
    }),
    prisma.amenity.upsert({
      where: { name: 'Balcony' },
      update: {},
      create: { name: 'Balcony' },
    }),
    prisma.amenity.upsert({
      where: { name: 'Ocean View' },
      update: {},
      create: { name: 'Ocean View' },
    }),
  ]);

  // Create rooms for each hotel
  const rooms = await Promise.all([
    // Grand Plaza Hotel rooms
    prisma.room.upsert({
      where: { id: 'room-1' },
      update: {},
      create: {
        id: 'room-1',
        hotelId: hotels[0].id,
        name: 'Deluxe King Room',
        description: 'Spacious room with king bed and city views',
        priceCents: 25000, // $250
        capacity: 2,
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-2' },
      update: {},
      create: {
        id: 'room-2',
        hotelId: hotels[0].id,
        name: 'Executive Suite',
        description: 'Luxury suite with separate living area',
        priceCents: 45000, // $450
        capacity: 4,
      },
    }),
    // Seaside Resort rooms
    prisma.room.upsert({
      where: { id: 'room-3' },
      update: {},
      create: {
        id: 'room-3',
        hotelId: hotels[1].id,
        name: 'Ocean View Room',
        description: 'Room with direct ocean views and balcony',
        priceCents: 35000, // $350
        capacity: 2,
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-4' },
      update: {},
      create: {
        id: 'room-4',
        hotelId: hotels[1].id,
        name: 'Family Suite',
        description: 'Large suite perfect for families',
        priceCents: 55000, // $550
        capacity: 6,
      },
    }),
    // Mountain View Lodge rooms
    prisma.room.upsert({
      where: { id: 'room-5' },
      update: {},
      create: {
        id: 'room-5',
        hotelId: hotels[2].id,
        name: 'Cozy Cabin',
        description: 'Rustic cabin with mountain views',
        priceCents: 18000, // $180
        capacity: 2,
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-6' },
      update: {},
      create: {
        id: 'room-6',
        hotelId: hotels[2].id,
        name: 'Mountain Suite',
        description: 'Luxury suite with panoramic mountain views',
        priceCents: 32000, // $320
        capacity: 4,
      },
    }),
  ]);

  // Add amenities to rooms
  await Promise.all([
    // WiFi to all rooms
    ...rooms.map(room => 
      prisma.roomAmenity.upsert({
        where: { roomId_amenityId: { roomId: room.id, amenityId: amenities[0].id } },
        update: {},
        create: { roomId: room.id, amenityId: amenities[0].id },
      })
    ),
    // Air Conditioning to all rooms
    ...rooms.map(room => 
      prisma.roomAmenity.upsert({
        where: { roomId_amenityId: { roomId: room.id, amenityId: amenities[1].id } },
        update: {},
        create: { roomId: room.id, amenityId: amenities[1].id },
      })
    ),
    // TV to all rooms
    ...rooms.map(room => 
      prisma.roomAmenity.upsert({
        where: { roomId_amenityId: { roomId: room.id, amenityId: amenities[2].id } },
        update: {},
        create: { roomId: room.id, amenityId: amenities[2].id },
      })
    ),
    // Ocean View to Seaside Resort rooms
    prisma.roomAmenity.upsert({
      where: { roomId_amenityId: { roomId: rooms[2].id, amenityId: amenities[5].id } },
      update: {},
      create: { roomId: rooms[2].id, amenityId: amenities[5].id },
    }),
    prisma.roomAmenity.upsert({
      where: { roomId_amenityId: { roomId: rooms[3].id, amenityId: amenities[5].id } },
      update: {},
      create: { roomId: rooms[3].id, amenityId: amenities[5].id },
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log('Test user: test@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
