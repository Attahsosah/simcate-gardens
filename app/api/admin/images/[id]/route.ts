import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Try to find the image in both tables
    let image: Awaited<ReturnType<typeof prisma.resortImage.findUnique>> | Awaited<ReturnType<typeof prisma.roomImage.findUnique>> = await prisma.resortImage.findUnique({
      where: { id },
      include: { resort: true },
    });

    let imageType = 'resort';

    if (!image) {
      image = await prisma.roomImage.findUnique({
        where: { id },
        include: { room: true },
      });
      imageType = 'room';
    }

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const filepath = join(process.cwd(), 'public', image.url);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Delete from database
    if (imageType === 'resort') {
      await prisma.resortImage.delete({
        where: { id },
      });
    } else {
      await prisma.roomImage.delete({
        where: { id },
      });
    }

    return NextResponse.json({ 
      message: "Image deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
