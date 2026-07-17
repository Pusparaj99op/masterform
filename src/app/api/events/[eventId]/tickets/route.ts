import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const ticketSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional().nullable(),
  price: z.number().min(0).default(0),
  currency: z.string().length(3).default("INR"),
  quantity: z.number().int().positive().optional().nullable(),
  maxPerOrder: z.number().int().positive().max(20).default(10),
  minPerOrder: z.number().int().positive().default(1),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// GET /api/events/[eventId]/tickets
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const tickets = await db.ticketType.findMany({
    where: { eventId },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(tickets);
}

// POST /api/events/[eventId]/tickets
export async function POST(
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
    const data = ticketSchema.parse(body);

    const ticket = await db.ticketType.create({
      data: { ...data, eventId },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
