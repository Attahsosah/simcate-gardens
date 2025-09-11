import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding customization data...');

  // Seed section content
  const sectionContent = [
    {
      section: 'hero',
      title: 'Welcome to Simcate Gardens',
      subtitle: 'Your tropical paradise awaits with pristine beaches, luxury accommodations, and world-class facilities',
      description: 'Experience luxury and comfort in our stunning beachfront resort with world-class amenities and breathtaking ocean views.',
      ctaText: 'Explore Our Resort',
      ctaLink: '/resort'
    },
    {
      section: 'facilities',
      title: 'Our World-Class Facilities',
      subtitle: 'Discover the exceptional amenities that make Simcate Gardens the perfect destination for your dream vacation',
      description: 'From our infinity pool overlooking the ocean to our state-of-the-art spa, every facility is designed for your comfort and enjoyment.',
      ctaText: 'Explore Facilities',
      ctaLink: '/facilities'
    },
    {
      section: 'restaurant',
      title: 'Culinary Excellence at Ocean Breeze Restaurant',
      subtitle: 'Fine dining with spectacular views',
      description: 'Savor exquisite cuisine prepared by our award-winning chefs while enjoying panoramic ocean views from our elegant dining room.',
      ctaText: 'View Menu',
      ctaLink: '/restaurant'
    },
    {
      section: 'gallery',
      title: 'Photo Gallery',
      subtitle: 'Capturing moments of paradise',
      description: 'Browse through our collection of stunning photos showcasing the beauty of our resort, rooms, facilities, and surrounding landscapes.',
      ctaText: 'View All Photos',
      ctaLink: '/gallery'
    },
    {
      section: 'rooms',
      title: 'Luxurious Accommodations',
      subtitle: 'Comfort meets elegance',
      description: 'Choose from our range of beautifully appointed rooms and suites, each designed to provide the ultimate in comfort and luxury.',
      ctaText: 'View Rooms',
      ctaLink: '/rooms'
    },
    {
      section: 'activities',
      title: 'Exciting Activities',
      subtitle: 'Adventure awaits at every turn',
      description: 'From water sports and beach activities to cultural tours and wellness programs, there\'s something for everyone to enjoy.',
      ctaText: 'Explore Activities',
      ctaLink: '/activities'
    }
  ];

  for (const content of sectionContent) {
    await prisma.sectionContent.upsert({
      where: { section: content.section },
      update: content,
      create: content,
    });
  }

  // Seed color schemes
  const colorSchemes = [
    {
      section: 'hero',
      primaryColor: '#4F46E5',
      secondaryColor: '#7C3AED',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      section: 'facilities',
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      backgroundColor: '#F9FAFB',
      textColor: '#374151'
    },
    {
      section: 'restaurant',
      primaryColor: '#EA580C',
      secondaryColor: '#F97316',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      section: 'gallery',
      primaryColor: '#7C3AED',
      secondaryColor: '#A855F7',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      section: 'rooms',
      primaryColor: '#2563EB',
      secondaryColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    {
      section: 'activities',
      primaryColor: '#DC2626',
      secondaryColor: '#EF4444',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    }
  ];

  for (const scheme of colorSchemes) {
    await prisma.colorScheme.upsert({
      where: { section: scheme.section },
      update: scheme,
      create: scheme,
    });
  }

  // Seed some sample section images
  const sectionImages = [
    {
      section: 'hero',
      url: '/api/placeholder-image?section=hero&caption=Beach%20Sunset',
      caption: 'Beach Sunset',
      position: 1
    },
    {
      section: 'restaurant',
      url: '/api/placeholder-image?section=restaurant&caption=Fine%20Dining',
      caption: 'Fine Dining',
      position: 1
    },
    {
      section: 'facilities',
      url: '/api/placeholder-image?section=facilities&caption=Infinity%20Pool',
      caption: 'Infinity Pool',
      position: 1
    }
  ];

  for (const image of sectionImages) {
    await prisma.sectionImage.create({
      data: image,
    });
  }

  console.log('✅ Customization data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding customization data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
