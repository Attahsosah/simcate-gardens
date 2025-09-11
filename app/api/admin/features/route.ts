import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const features = await prisma.feature.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ features });
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, icon, position, isActive, section } = body;

    if (!title || !description || !section) {
      return NextResponse.json(
        { error: "Title, description, and section are required" },
        { status: 400 }
      );
    }

    const feature = await prisma.feature.create({
      data: {
        section,
        title,
        description,
        icon: icon || "",
        position: position ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ feature });
  } catch (error) {
    console.error("Error creating feature:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

