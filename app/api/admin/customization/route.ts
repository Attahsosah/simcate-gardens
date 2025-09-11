import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch all customization data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [sectionContent, colorSchemes, sectionImages, features] = await Promise.all([
      prisma.sectionContent.findMany(),
      prisma.colorScheme.findMany(),
      prisma.sectionImage.findMany({
        orderBy: { position: 'asc' }
      }),
      prisma.feature.findMany({
        orderBy: { position: 'asc' }
      })
    ]);

    return NextResponse.json({
      sectionContent,
      colorSchemes,
      sectionImages,
      features
    });
  } catch (error) {
    console.error('Error fetching customization data:', error);
    return NextResponse.json(
      { error: "Failed to fetch customization data" },
      { status: 500 }
    );
  }
}

// POST - Create or update customization data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sectionContent, colorSchemes, sectionImages } = body;

    // Update section content
    if (sectionContent) {
      for (const content of sectionContent) {
        await prisma.sectionContent.upsert({
          where: { section: content.section },
          update: {
            title: content.title,
            subtitle: content.subtitle,
            description: content.description,
            ctaText: content.ctaText,
            ctaLink: content.ctaLink,
          },
          create: {
            section: content.section,
            title: content.title,
            subtitle: content.subtitle,
            description: content.description,
            ctaText: content.ctaText,
            ctaLink: content.ctaLink,
          },
        });
      }
    }

    // Update color schemes
    if (colorSchemes) {
      for (const scheme of colorSchemes) {
        await prisma.colorScheme.upsert({
          where: { section: scheme.section },
          update: {
            primaryColor: scheme.primaryColor,
            secondaryColor: scheme.secondaryColor,
            backgroundColor: scheme.backgroundColor,
            textColor: scheme.textColor,
          },
          create: {
            section: scheme.section,
            primaryColor: scheme.primaryColor,
            secondaryColor: scheme.secondaryColor,
            backgroundColor: scheme.backgroundColor,
            textColor: scheme.textColor,
          },
        });
      }
    }

    // Update section images
    if (sectionImages) {
      // First, delete all existing images for the sections being updated
      const sectionsToUpdate = [...new Set(sectionImages.map((img: { section: string }) => img.section))];
      await prisma.sectionImage.deleteMany({
        where: { section: { in: sectionsToUpdate } }
      });

      // Then create new images
      for (const image of sectionImages) {
        await prisma.sectionImage.create({
          data: {
            section: image.section,
            url: image.url,
            caption: image.caption,
            position: image.position,
          },
        });
      }
    }

    return NextResponse.json({ message: "Customization data updated successfully" });
  } catch (error) {
    console.error('Error updating customization data:', error);
    return NextResponse.json(
      { error: "Failed to update customization data" },
      { status: 500 }
    );
  }
}
