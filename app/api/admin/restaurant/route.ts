import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Get restaurant customization data
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get restaurant section content
    const restaurantContent = await prisma.sectionContent.findFirst({
      where: { section: 'restaurant' }
    });

    // Get restaurant features
    const restaurantFeatures = await prisma.feature.findMany({
      where: { 
        section: 'restaurant',
        isActive: true 
      },
      orderBy: { position: 'asc' }
    });

    // Get restaurant images
    const restaurantImages = await prisma.sectionImage.findMany({
      where: { section: 'restaurant' },
      orderBy: { createdAt: 'desc' }
    });

    const restaurantDetails = await prisma.restaurantDetail.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({
      content: restaurantContent,
      features: restaurantFeatures,
      images: restaurantImages,
      details: restaurantDetails
    });
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update restaurant customization data
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { content, features, details } = body;

    // Update or create restaurant section content
    if (content) {
      await prisma.sectionContent.upsert({
        where: { section: 'restaurant' },
        update: {
          title: content.title,
          subtitle: content.subtitle,
          description: content.description,
          ctaText: content.ctaText,
          ctaLink: content.ctaLink
        },
        create: {
          section: 'restaurant',
          title: content.title,
          subtitle: content.subtitle,
          description: content.description,
          ctaText: content.ctaText,
          ctaLink: content.ctaLink
        }
      });
    }

    // Update restaurant features
    if (features && Array.isArray(features)) {
      // Delete existing restaurant features
      await prisma.feature.deleteMany({
        where: { section: 'restaurant' }
      });

      // Create new features
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        await prisma.feature.create({
          data: {
            section: 'restaurant',
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            position: i + 1,
            isActive: true
          }
        });
      }
    }

    // Update restaurant details
    if (details && Array.isArray(details)) {
      // Delete existing restaurant details
      await prisma.restaurantDetail.deleteMany({});

      // Create new details
      for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        await prisma.restaurantDetail.create({
          data: {
            title: detail.title,
            subtitle: detail.subtitle,
            icon: detail.icon,
            position: i + 1,
            isActive: true
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating restaurant data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
