import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch customization data for public use
export async function GET() {
  try {
    const [sectionContent, colorSchemes, sectionImages, features] = await Promise.all([
      prisma.sectionContent.findMany(),
      prisma.colorScheme.findMany(),
      prisma.sectionImage.findMany({
        orderBy: { position: 'asc' }
      }),
      prisma.feature.findMany({
        where: { isActive: true },
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
