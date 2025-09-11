import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
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

    const body = await request.json();
    const {
      name,
      description,
      price,
      capacity,
      roomType,
      selectedAmenities,
    } = body;

    // Validation
    if (!name || !description || !price || !capacity || !roomType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (capacity < 1 || capacity > 10) {
      return NextResponse.json(
        { error: "Capacity must be between 1 and 10" },
        { status: 400 }
      );
    }

    const { id } = await params;
    
    // Update the room
    const room = await prisma.room.update({
      where: { id },
      data: {
        name,
        description,
        price,
        capacity: parseInt(capacity),
        roomType,
        amenities: {
          deleteMany: {},
          create: selectedAmenities && selectedAmenities.length > 0 ? 
            selectedAmenities.map((amenity: string) => ({
              amenity: amenity
            })) : []
        },
      },
      include: {
        amenities: true,
        resort: true,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Check if room has any bookings
    const existingBookings = await prisma.booking.findFirst({
      where: { roomId: id },
    });

    if (existingBookings) {
      return NextResponse.json(
        { error: "Cannot delete room with existing bookings" },
        { status: 400 }
      );
    }

    // Delete the room
    await prisma.room.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const body = await request.json();
    const { previewImageUrl } = body;

    const { id } = await params;

    // Update only the preview image URL
    const room = await prisma.room.update({
      where: { id },
      data: {
        previewImageUrl,
      },
      include: {
        amenities: true,
        resort: true,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error updating room preview image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        amenities: true,
        resort: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
