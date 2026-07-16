import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/events/[eventId]/guests
export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireUser();
    const { eventId } = await params;
    const { searchParams } = new URL(req.url);

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (event.hostId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");

    const where = {
      eventId,
      ...(status ? { status: status as "GOING" | "WAITLISTED" | "PENDING_APPROVAL" | "DECLINED" | "CANCELLED" } : {}),
      ...(search ? {
        OR: [
          { guestName: { contains: search, mode: "insensitive" as const } },
          { guestEmail: { contains: search, mode: "insensitive" as const } },
          { user: { name: { contains: search, mode: "insensitive" as const } } },
          { user: { email: { contains: search, mode: "insensitive" as const } } },
        ],
      } : {}),
    };

    const [registrations, total] = await Promise.all([
      db.registration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { name: true, avatarUrl: true, email: true } },
          ticketType: { select: { name: true, price: true } },
          answers: { include: { question: true } },
        },
      }),
      db.registration.count({ where }),
    ]);

    // Stats
    const stats = await db.registration.groupBy({
      by: ["status"],
      where: { eventId },
      _count: true,
    });

    const statMap = Object.fromEntries(stats.map((s) => [s.status, s._count]));

    return NextResponse.json({ registrations, total, page, limit, stats: statMap });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
