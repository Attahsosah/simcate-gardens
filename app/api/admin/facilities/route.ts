import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const facilities = await prisma.facility.findMany({
      include: {
        resort: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ facilities });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, facilityType, isActive, imageUrl } = body;

    if (!name || !facilityType) {
      return NextResponse.json(
        { error: "Name and facility type are required" },
        { status: 400 }
      );
    }

    // Get the first resort (assuming single resort for now)
    const resort = await prisma.resort.findFirst();
    if (!resort) {
      return NextResponse.json(
        { error: "No resort found" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.create({
      data: {
        name,
        description: description || null,
        facilityType,
        isActive: isActive ?? true,
        imageUrl: imageUrl || null,
        resortId: resort.id,
      },
    });

    return NextResponse.json({ facility });
  } catch (error) {
    console.error("Error creating facility:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
