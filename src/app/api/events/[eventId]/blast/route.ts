import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import { blastRatelimit } from "@/lib/ratelimit";

const blastSchema = z.object({
  subject: z.string().optional(),
  body: z.string().min(1).max(5000),
  sentTo: z.enum(["ALL", "GOING", "WAITLISTED", "PENDING_APPROVAL", "CHECKED_IN"]).default("GOING"),
});

// POST /api/events/[eventId]/blast
export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireUser();
    const { eventId } = await params;

    // Rate limit
    const { success } = await blastRatelimit.limit(user.id);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait before sending another blast." }, { status: 429 });
    }

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (event.hostId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = blastSchema.parse(body);

    // Get target registrations
    const statusFilter: Record<string, string | string[]> = {
      ALL: ["GOING", "WAITLISTED", "PENDING_APPROVAL"],
      GOING: "GOING",
      WAITLISTED: "WAITLISTED",
      PENDING_APPROVAL: "PENDING_APPROVAL",
      CHECKED_IN: "GOING",
    };

    const where = {
      eventId,
      status: Array.isArray(statusFilter[data.sentTo])
        ? { in: statusFilter[data.sentTo] as string[] }
        : (statusFilter[data.sentTo] as string),
      ...(data.sentTo === "CHECKED_IN" ? { checkInAt: { not: null } } : {}),
    };

    const registrations = await db.registration.findMany({
      where,
      select: {
        guestEmail: true,
        guestName: true,
        user: { select: { email: true, name: true } },
      },
    });

    const emails = registrations
      .map((r) => r.guestEmail ?? r.user?.email)
      .filter(Boolean) as string[];

    // Send emails in batches of 50 via Resend batch API
    let sentCount = 0;
    const from = process.env.RESEND_FROM_EMAIL ?? "EventFlow <events@eventflow.app>";
    const batchSize = 50;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      try {
        await resend.batch.send(
          batch.map((email) => ({
            from,
            to: email,
            subject: data.subject ?? `Update about ${event.title}`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
              <h2 style="color:#0C0C0E;">${data.subject ?? event.title}</h2>
              <p style="color:#444;line-height:1.6;">${data.body.replace(/\n/g, "<br>")}</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
              <p style="color:#999;font-size:12px;">You received this because you registered for <strong>${event.title}</strong>.</p>
            </div>`,
          }))
        );
        sentCount += batch.length;
      } catch (e) {
        console.error("Batch send error:", e);
      }
    }

    // Record blast
    const blast = await db.blast.create({
      data: {
        eventId,
        senderId: user.id,
        subject: data.subject,
        body: data.body,
        sentTo: data.sentTo,
        recipientCount: sentCount,
      },
    });

    return NextResponse.json({ success: true, blast, recipientCount: sentCount });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
