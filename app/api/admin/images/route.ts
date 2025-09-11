import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Upload image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File || formData.get('file') as File;
    const type = formData.get('type') as string;
    const entityId = formData.get('entityId') as string || formData.get('id') as string;
    const caption = formData.get('caption') as string;

    if (!image || !type || !entityId) {
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
    const filename = `${type}_${entityId}_${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const imageUrl = `/uploads/${filename}`;
    let savedImage;

    if (type === 'resort') {
      savedImage = await prisma.resortImage.create({
        data: {
          resortId: entityId,
          url: imageUrl,
          caption: caption || null,
        },
        include: {
          resort: true,
        },
      });
    } else if (type === 'room') {
      savedImage = await prisma.roomImage.create({
        data: {
          roomId: entityId,
          url: imageUrl,
          caption: caption || null,
        },
        include: {
          room: true,
        },
      });
    } else if (type === 'facility') {
      // For facilities, we just return the URL since they store imageUrl directly
      savedImage = { url: imageUrl };
    }

    return NextResponse.json({ 
      image: savedImage,
      url: imageUrl,
      message: "Image uploaded successfully" 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all images
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch resort images
    const resortImages = await prisma.resortImage.findMany({
      include: {
        resort: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch room images
    const roomImages = await prisma.roomImage.findMany({
      include: {
        room: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Combine and format images
    const images = [
      ...resortImages.map(img => ({
        id: img.id,
        url: img.url,
        caption: img.caption,
        type: "resort" as const,
        entityId: img.resortId,
        entityName: img.resort.name,
        createdAt: img.createdAt,
      })),
      ...roomImages.map(img => ({
        id: img.id,
        url: img.url,
        caption: null,
        type: "room" as const,
        entityId: img.roomId,
        entityName: img.room.name,
        createdAt: img.createdAt,
      })),
    ];

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
