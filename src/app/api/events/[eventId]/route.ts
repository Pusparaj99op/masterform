import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteR2Object } from "@/lib/r2";

// GET /api/events/[eventId]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      host: { select: { id: true, name: true, avatarUrl: true, twitterHandle: true, websiteUrl: true } },
      cohosts: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
      ticketTypes: { orderBy: { sortOrder: "asc" } },
      regQuestions: { orderBy: { sortOrder: "asc" } },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().nullable(),
  coverImageR2Key: z.string().optional().nullable(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional().nullable(),
  timezone: z.string().optional(),
  locationType: z.enum(["IN_PERSON", "ONLINE", "HYBRID"]).optional(),
  locationName: z.string().optional().nullable(),
  locationAddress: z.string().optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  onlineUrl: z.string().url().optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  registrationStatus: z.enum(["OPEN", "CLOSED", "WAITLIST_ONLY"]).optional(),
  waitlistEnabled: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),
  groupRegistration: z.boolean().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  platformFeeRate: z.number().min(0).max(0.05).optional(),
}).partial();

// PATCH /api/events/[eventId]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireUser();
    const { eventId } = await params;

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (event.hostId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = patchSchema.parse(body);

    const updated = await db.event.update({
      where: { id: eventId },
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt !== undefined ? (data.endsAt ? new Date(data.endsAt) : null) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/events/[eventId]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireUser();
    const { eventId } = await params;

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (event.hostId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Delete cover image from R2 if exists
    if (event.coverImageR2Key) {
      await deleteR2Object(event.coverImageR2Key).catch(console.error);
    }

    await db.event.delete({ where: { id: eventId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
