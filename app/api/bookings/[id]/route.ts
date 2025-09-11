import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Cancel a booking (user can only cancel their own bookings)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action !== 'cancel') {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Check if booking exists and belongs to the user
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: {
          include: {
            resort: true,
          },
        },
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the booking belongs to the current user
    if (existingBooking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only cancel your own bookings" },
        { status: 403 }
      );
    }

    // Check if booking can be cancelled (only PENDING or CONFIRMED bookings)
    if (existingBooking.status === 'CANCELLED' || existingBooking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: "This booking cannot be cancelled" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        user: true,
        room: {
          include: {
            resort: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      booking: updatedBooking,
      message: "Booking cancelled successfully" 
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get a specific booking (user can only view their own bookings)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: {
          include: {
            resort: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the booking belongs to the current user
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only view your own bookings" },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
