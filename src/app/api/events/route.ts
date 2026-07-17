import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  coverImageR2Key: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  timezone: z.string().default("UTC"),
  locationType: z.enum(["IN_PERSON", "ONLINE", "HYBRID"]).default("IN_PERSON"),
  locationName: z.string().optional(),
  locationAddress: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  onlineUrl: z.string().url().optional(),
  capacity: z.number().int().positive().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).default("PUBLIC"),
  calendarId: z.string().optional(),
  slug: z.string().optional(),
  requiresApproval: z.boolean().default(false),
  waitlistEnabled: z.boolean().default(true),
  groupRegistration: z.boolean().default(false),
});

// GET /api/events — list events for current user
export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const status = searchParams.get("status");

    const where = {
      hostId: user.id,
      ...(status === "upcoming" ? { startsAt: { gte: new Date() } } : {}),
      ...(status === "past" ? { startsAt: { lt: new Date() } } : {}),
    };

    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        orderBy: { startsAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { registrations: true } },
          ticketTypes: { select: { price: true } },
        },
      }),
      db.event.count({ where }),
    ]);

    return NextResponse.json({ events, total, page, limit });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/events — create event
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = createEventSchema.parse(body);

    const slug = data.slug ?? generateSlug(10);

    const event = await db.event.create({
      data: {
        ...data,
        slug,
        hostId: user.id,
        startsAt: new Date(data.startsAt),
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
      },
    });

    return NextResponse.json(event, { status: 201 });
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
