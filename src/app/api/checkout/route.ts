import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { stripe, toSmallestUnit, calculatePlatformFee } from "@/lib/stripe";
import { registrationRatelimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

const checkoutSchema = z.object({
  eventId: z.string(),
  ticketSelections: z.array(z.object({
    ticketTypeId: z.string(),
    quantity: z.number().int().positive().max(10),
  })).min(1),
  guestInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  couponCode: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referredBy: z.string().optional(),
});

// POST /api/checkout
export async function POST(req: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  // Rate limit by IP
  const { success } = await registrationRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    const event = await db.event.findUnique({
      where: { id: data.eventId },
      include: {
        host: { include: { stripeAccount: true } },
        ticketTypes: true,
        coupons: { where: { isActive: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.registrationStatus === "CLOSED") {
      return NextResponse.json({ error: "Registration is closed" }, { status: 400 });
    }

    // Validate tickets & build line items
    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    let subtotalPaise = 0;
    const firstTicketTypeId = data.ticketSelections[0]?.ticketTypeId;

    for (const sel of data.ticketSelections) {
      const ticket = event.ticketTypes.find((t) => t.id === sel.ticketTypeId);
      if (!ticket) {
        return NextResponse.json({ error: `Ticket type ${sel.ticketTypeId} not found` }, { status: 400 });
      }
      if (!ticket.isVisible) {
        return NextResponse.json({ error: "Ticket is not available" }, { status: 400 });
      }
      if (ticket.quantity !== null && ticket.quantity - ticket.quantitySold < sel.quantity) {
        return NextResponse.json({ error: `Not enough ${ticket.name} tickets available` }, { status: 400 });
      }

      const unitAmountSmallest = toSmallestUnit(ticket.price, ticket.currency);
      subtotalPaise += unitAmountSmallest * sel.quantity;

      lineItems.push({
        price_data: {
          currency: ticket.currency.toLowerCase(),
          product_data: { name: `${ticket.name} — ${event.title}` },
          unit_amount: unitAmountSmallest,
        },
        quantity: sel.quantity,
      });
    }

    // Handle free events
    const isFree = subtotalPaise === 0;
    if (isFree) {
      // Create free registration directly
      const registration = await db.registration.create({
        data: {
          eventId: event.id,
          ticketTypeId: firstTicketTypeId!,
          guestName: data.guestInfo.name,
          guestEmail: data.guestInfo.email,
          status: event.requiresApproval ? "PENDING_APPROVAL" : "GOING",
          paymentStatus: "FREE",
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
          referredBy: data.referredBy,
        },
      });

      // Increment quantitySold
      if (firstTicketTypeId) {
        await db.ticketType.update({
          where: { id: firstTicketTypeId },
          data: { quantitySold: { increment: 1 } },
        });
      }

      return NextResponse.json({
        free: true,
        registrationId: registration.id,
        successUrl: `${process.env.NEXT_PUBLIC_URL}/e/${event.slug}/success?reg=${registration.id}`,
      });
    }

    // Paid — need Stripe Connect account
    if (!event.host.stripeAccount?.chargesEnabled) {
      return NextResponse.json({ error: "Organizer has not set up payments" }, { status: 400 });
    }

    // Apply coupon
    let discounts: { coupon: string }[] = [];
    if (data.couponCode) {
      const coupon = await db.coupon.findFirst({
        where: {
          eventId: event.id,
          code: data.couponCode.toUpperCase(),
          isActive: true,
          AND: [
            { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
            { OR: [{ maxUses: null }, { usedCount: { lt: 999999 } }] },
          ],
        },
      });
      if (coupon?.stripeCouponId) {
        discounts = [{ coupon: coupon.stripeCouponId }];
      }
    }

    // Platform fee
    const platformFee = calculatePlatformFee(subtotalPaise, event.platformFeeRate);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      line_items: lineItems,
      mode: "payment",
      discounts,
      payment_intent_data: {
        ...(platformFee > 0
          ? {
              application_fee_amount: platformFee,
              transfer_data: {
                destination: event.host.stripeAccount!.stripeAccountId,
              },
            }
          : {}),
      },
      customer_email: data.guestInfo.email,
      success_url: `${process.env.NEXT_PUBLIC_URL}/e/${event.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/e/${event.slug}/register`,
      metadata: {
        eventId: event.id,
        ticketTypeId: firstTicketTypeId ?? "",
        guestInfo: JSON.stringify(data.guestInfo),
        utmSource: data.utmSource ?? "",
        utmMedium: data.utmMedium ?? "",
        utmCampaign: data.utmCampaign ?? "",
        referredBy: data.referredBy ?? "",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.issues }, { status: 422 });
    }
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
