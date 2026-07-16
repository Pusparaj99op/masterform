import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/pageview — lightweight analytics ingestion (fire and forget)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, source, country, device } = body;

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ error: "eventId required" }, { status: 400 });
    }

    // Fire and forget — don't await in the response path
    Promise.all([
      db.pageView.create({
        data: {
          eventId,
          source: source ?? null,
          country: country ?? null,
          device: device ?? null,
        },
      }),
      db.event.update({
        where: { id: eventId },
        data: { viewCount: { increment: 1 } },
      }),
    ]).catch(console.error);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 }); // Always 200 for analytics
  }
}
