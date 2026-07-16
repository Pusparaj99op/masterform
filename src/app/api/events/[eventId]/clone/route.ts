import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

// POST /api/events/[eventId]/clone
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireUser();
    const { eventId } = await params;

    const source = await db.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTypes: true,
        regQuestions: true,
      },
    });

    if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (source.hostId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const newSlug = generateSlug(10);

    // Clone the event
    const cloned = await db.event.create({
      data: {
        slug: newSlug,
        hostId: user.id,
        calendarId: source.calendarId,
        title: `${source.title} (Copy)`,
        description: source.description,
        coverImageUrl: source.coverImageUrl,
        startsAt: new Date(source.startsAt.getTime() + 7 * 24 * 60 * 60 * 1000), // +1 week
        endsAt: source.endsAt
          ? new Date(source.endsAt.getTime() + 7 * 24 * 60 * 60 * 1000)
          : null,
        timezone: source.timezone,
        locationType: source.locationType,
        locationName: source.locationName,
        locationAddress: source.locationAddress,
        locationLat: source.locationLat,
        locationLng: source.locationLng,
        onlineUrl: source.onlineUrl,
        capacity: source.capacity,
        waitlistEnabled: source.waitlistEnabled,
        requireApproval: source.requireApproval,
        groupRegistration: source.groupRegistration,
        maxGroupSize: source.maxGroupSize,
        visibility: "PRIVATE", // Start cloned event as private
        platformFeeRate: source.platformFeeRate,
      },
    });

    // Clone ticket types
    for (const ticket of source.ticketTypes) {
      await db.ticketType.create({
        data: {
          eventId: cloned.id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          currency: ticket.currency,
          quantity: ticket.quantity,
          maxPerOrder: ticket.maxPerOrder,
          minPerOrder: ticket.minPerOrder,
          sortOrder: ticket.sortOrder,
          // Reset Stripe IDs — new event needs new products
        },
      });
    }

    // Clone registration questions
    for (const q of source.regQuestions) {
      await db.regQuestion.create({
        data: {
          eventId: cloned.id,
          label: q.label,
          type: q.type,
          options: q.options,
          isRequired: q.isRequired,
          sortOrder: q.sortOrder,
        },
      });
    }

    return NextResponse.json({ event: cloned }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
