import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/resend";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;
        if (!metadata?.eventId) break;

        const guestInfo = metadata.guestInfo ? JSON.parse(metadata.guestInfo) : {};
        const ticketTypeId = metadata.ticketTypeId;

        if (!ticketTypeId) break;

        // Create registration
        const registration = await db.registration.create({
          data: {
            eventId: metadata.eventId,
            ticketTypeId,
            guestName: guestInfo.name ?? null,
            guestEmail: session.customer_details?.email ?? null,
            status: "GOING",
            paymentStatus: "PAID",
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string ?? null,
            amountPaid: session.amount_total ? session.amount_total / 100 : null,
            currency: session.currency?.toUpperCase() ?? "INR",
            utmSource: metadata.utmSource ?? null,
            utmMedium: metadata.utmMedium ?? null,
            utmCampaign: metadata.utmCampaign ?? null,
          },
          include: {
            event: { include: { host: true } },
            ticketType: true,
          },
        });

        // Update quantitySold
        await db.ticketType.update({
          where: { id: ticketTypeId },
          data: { quantitySold: { increment: 1 } },
        });

        console.log(`✅ Registration created: ${registration.id}`);
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        await db.stripeAccount.updateMany({
          where: { stripeAccountId: account.id },
          data: {
            chargesEnabled: account.charges_enabled ?? false,
            payoutsEnabled: account.payouts_enabled ?? false,
            onboardingComplete: account.details_submitted ?? false,
          },
        });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;
        if (paymentIntentId) {
          await db.registration.updateMany({
            where: { stripePaymentIntentId: paymentIntentId },
            data: {
              paymentStatus: "REFUNDED",
              refundedAt: new Date(),
              refundAmount: charge.amount_refunded / 100,
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
