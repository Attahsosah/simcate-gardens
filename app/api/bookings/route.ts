import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { isRoomAvailable } from "@/lib/bookings";

const BookingInputSchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  numGuests: z.number().int().positive(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BookingInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { roomId, checkIn, checkOut, numGuests } = parsed.data;
  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);
  if (!(checkOutDate > checkInDate)) {
    return NextResponse.json(
      { error: "checkOut must be after checkIn" },
      { status: 400 }
    );
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (numGuests > room.capacity) {
    return NextResponse.json(
      { error: `Room capacity is ${room.capacity}` },
      { status: 400 }
    );
  }

  const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
  if (!available) {
    return NextResponse.json(
      { error: "Room is not available for these dates" },
      { status: 409 }
    );
  }

  const nights = Math.max(1, differenceInCalendarDays(checkOutDate, checkInDate));
  const totalCents = nights * room.priceCents;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numGuests,
      totalCents,
      status: "PENDING",
    },
  });

  return NextResponse.json({ booking });
}



