import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { put } from "@vercel/blob";

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
    const replaceImageId = formData.get('replaceImageId') as string;

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

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = image.name.split('.').pop();
    const filename = `${type}_${entityId}_${timestamp}.${fileExtension}`;

    // Check if we're in production (Vercel) or development
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    let imageUrl: string;
    
    if (isProduction) {
      // Use Vercel Blob Storage in production
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType: image.type,
        });
        
        imageUrl = blob.url;
      } catch (blobError) {
        console.error('Vercel Blob Storage error:', blobError);
        throw new Error(`Failed to upload to cloud storage: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`);
      }
    } else {
      // Use local file system in development
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const filepath = join(uploadsDir, filename);
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      
      imageUrl = `/uploads/${filename}`;
    }
    let savedImage;

    if (type === 'resort') {
      if (replaceImageId) {
        // Replace existing image
        savedImage = await prisma.resortImage.update({
          where: { id: replaceImageId },
          data: {
            url: imageUrl,
            caption: caption || null,
          },
          include: {
            resort: true,
          },
        });
      } else {
        // Create new image
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
      }
    } else if (type === 'room') {
      if (replaceImageId) {
        // Replace existing image - get the room ID from the existing image
        const existingImage = await prisma.roomImage.findUnique({
          where: { id: replaceImageId },
          select: { roomId: true }
        });
        
        if (!existingImage) {
          return NextResponse.json(
            { error: "Image not found" },
            { status: 404 }
          );
        }

        savedImage = await prisma.roomImage.update({
          where: { id: replaceImageId },
          data: {
            url: imageUrl,
            caption: caption || null,
          },
          include: {
            room: true,
          },
        });
      } else {
        // Create new image
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
      }
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
