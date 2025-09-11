import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Received room data:", body);
    const {
      name,
      description,
      price,
      capacity,
      roomType,
      selectedAmenities,
      resortId,
    } = body;

    // Validation
    if (!name || !description || !price || !capacity || !roomType || !resortId) {
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

    // Create the room
    const room = await prisma.room.create({
      data: {
        name,
        description,
        price,
        capacity: parseInt(capacity),
        roomType,
        resortId,
        amenities: selectedAmenities && selectedAmenities.length > 0 ? {
          create: selectedAmenities.map((amenity: string) => ({
            amenity: amenity,
          }))
        } : undefined,
      },
      include: {
        amenities: true,
        resort: true,
      },
    });

    console.log("Room created successfully:", room.id);
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rooms = await prisma.room.findMany({
      include: {
        resort: true,
        amenities: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
