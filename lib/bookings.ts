import prisma from "@/lib/prisma";

export async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const overlapping = await prisma.booking.findFirst({
    where: {
      roomId,
      status: { in: ["PENDING", "CONFIRMED"] },
      // overlap: (A.start < B.end) && (A.end > B.start)
      AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
    },
    select: { id: true },
  });
  return !overlapping;
}



