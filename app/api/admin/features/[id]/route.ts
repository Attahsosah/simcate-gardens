import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, icon, position, isActive } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const updatedFeature = await prisma.feature.update({
      where: { id },
      data: {
        title,
        description,
        icon: icon || "",
        position: position ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ feature: updatedFeature });
  } catch (error) {
    console.error("Error updating feature:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.feature.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Feature deleted successfully" });
  } catch (error) {
    console.error("Error deleting feature:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

