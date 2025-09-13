import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: imageId } = await params;

    // Find the image to get its URL for potential cleanup
    const image = await prisma.roomImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete the image from database
    await prisma.roomImage.delete({
      where: { id: imageId },
    });

    // Note: We don't delete from Vercel Blob Storage as it's not critical
    // and the storage will clean up unused files automatically

    return NextResponse.json({ 
      message: 'Image deleted successfully',
      deletedImage: {
        id: image.id,
        url: image.url
      }
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: imageId } = await params;
    const { caption } = await request.json();

    // Update the image caption
    const updatedImage = await prisma.roomImage.update({
      where: { id: imageId },
      data: { caption },
    });

    return NextResponse.json({ 
      message: 'Image updated successfully',
      image: updatedImage
    });

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}