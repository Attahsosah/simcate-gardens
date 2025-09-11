import CustomizableHomepage from "@/app/components/CustomizableHomepage";
import prisma from "@/lib/prisma";

export default async function Home() {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return <CustomizableHomepage facilities={[]} rooms={[]} resortImages={[]} />;
    }

    // Fetch facilities and rooms for the homepage
    const facilities = await prisma.facility.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: "asc" },
    });

    const rooms = await prisma.room.findMany({
      include: {
        resort: true,
        amenities: {
          take: 3,
        },
        roomImages: true,
      },
      take: 6,
      orderBy: { price: "asc" },
    });

    // Fetch resort images
    const resortImages = await prisma.resortImage.findMany({
      include: {
        resort: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return <CustomizableHomepage facilities={facilities} rooms={rooms} resortImages={resortImages} />;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return with empty data if there's an error
    return <CustomizableHomepage facilities={[]} rooms={[]} resortImages={[]} />;
  }
}
