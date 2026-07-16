import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const checkInSchema = z.object({
  registrationId: z.string(),
});

// POST /api/events/[eventId]/checkin
export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireUser();
    const { eventId } = await params;

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { cohosts: true },
    });

    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Check access (host or cohost with canCheckIn)
    const isHost = event.hostId === user.id;
    const isCohost = event.cohosts.some(
      (c) => c.userId === user.id && c.canCheckIn
    );

    if (!isHost && !isCohost) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { registrationId } = checkInSchema.parse(body);

    const registration = await db.registration.findFirst({
      where: { id: registrationId, eventId },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        ticketType: { select: { name: true } },
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.checkInAt) {
      return NextResponse.json({
        error: "Already checked in",
        registration,
        alreadyCheckedIn: true,
      }, { status: 409 });
    }

    const updated = await db.registration.update({
      where: { id: registrationId },
      data: {
        checkInAt: new Date(),
        checkInBy: user.id,
      },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        ticketType: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error" }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
