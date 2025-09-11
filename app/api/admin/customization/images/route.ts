import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Upload section image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const section = formData.get('section') as string;
    const caption = formData.get('caption') as string;

    if (!image || !section) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = image.name.split('.').pop();
    const filename = `section_${section}_${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Get the next position for this section
    const existingImages = await prisma.sectionImage.findMany({
      where: { section },
      orderBy: { position: 'desc' },
      take: 1
    });
    const nextPosition = existingImages.length > 0 ? existingImages[0].position + 1 : 1;

    // Save to database
    const imageUrl = `/uploads/${filename}`;
    const savedImage = await prisma.sectionImage.create({
      data: {
        section,
        url: imageUrl,
        caption: caption || null,
        position: nextPosition,
      },
    });

    return NextResponse.json({ 
      image: savedImage,
      message: "Image uploaded successfully" 
    });
  } catch (error) {
    console.error("Error uploading section image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete section image
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Delete from database
    await prisma.sectionImage.delete({
      where: { id: imageId }
    });

    return NextResponse.json({ 
      message: "Image deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting section image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

