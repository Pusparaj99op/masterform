import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { ratelimit } from "@/lib/ratelimit";

const schema = z.object({
  eventId: z.string(),
  ticketTypeId: z.string(),
  quantity: z.number().int().min(1).max(10),
  guestInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  answers: z
    .array(z.object({ questionId: z.string(), answer: z.string() }))
    .optional()
    .default([]),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { userId } = await auth();

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { eventId, ticketTypeId, quantity, guestInfo, answers } = parsed.data;

    // Verify event exists, is public, and registration is open
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTypes: { where: { id: ticketTypeId } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.registrationStatus !== "OPEN") {
      return NextResponse.json({ error: "Registration is closed" }, { status: 400 });
    }

    const ticketType = event.ticketTypes[0];
    if (!ticketType) {
      return NextResponse.json({ error: "Ticket type not found" }, { status: 404 });
    }

    // Ensure this is a free ticket
    if (ticketType.price > 0) {
      return NextResponse.json(
        { error: "Paid tickets must go through Stripe checkout" },
        { status: 400 }
      );
    }

    // Check capacity
    if (ticketType.quantity !== null) {
      const remaining = ticketType.quantity - ticketType.quantitySold;
      if (remaining < quantity) {
        return NextResponse.json(
          { error: `Only ${remaining} spots remaining` },
          { status: 400 }
        );
      }
    }

    // Check overall event capacity
    if (event.capacity !== null) {
      const totalGoing = await db.registration.count({
        where: { eventId, status: "GOING" },
      });
      if (totalGoing + quantity > event.capacity) {
        return NextResponse.json({ error: "Event is at capacity" }, { status: 400 });
      }
    }

    // Find or create user by email
    let dbUser = await db.user.findUnique({
      where: { email: guestInfo.email },
    });

    if (!dbUser && userId) {
      // Try by Clerk ID
      dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    }

    // Create registrations (one per ticket quantity)
    const registrations = await db.$transaction(async (tx) => {
      const regs = [];
      for (let i = 0; i < quantity; i++) {
        const reg = await tx.registration.create({
          data: {
            eventId,
            ticketTypeId,
            userId: dbUser?.id ?? null,
            guestName: guestInfo.name,
            guestEmail: guestInfo.email,
            status: event.requiresApproval ? "WAITLISTED" : "GOING",
            paymentStatus: "FREE",
            amountPaid: 0,
            answers: {
              create: answers.map((a) => ({
                questionId: a.questionId,
                answer: a.answer,
              })),
            },
          },
          include: { event: { select: { title: true, slug: true } } },
        });
        regs.push(reg);
      }

      // Increment quantitySold on ticket type
      await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: { quantitySold: { increment: quantity } },
      });

      return regs;
    });

    return NextResponse.json({
      success: true,
      registrationId: registrations[0].id,
      status: registrations[0].status,
      eventSlug: event.slug,
    });
  } catch (err) {
    console.error("[api/registrations POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
