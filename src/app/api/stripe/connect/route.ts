import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// POST /api/stripe/connect — initiate or refresh Stripe Connect Express onboarding
export async function POST(req: Request) {
  try {
    const user = await requireUser();

    // Find or create Stripe Connect account
    let stripeAccountRecord = await db.stripeAccount.findUnique({
      where: { userId: user.id },
    });

    if (!stripeAccountRecord) {
      const stripeAcc = await stripe.accounts.create({
        type: "express",
        country: "IN",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        settings: {
          payouts: {
            schedule: { interval: "daily" },
          },
        },
      });

      stripeAccountRecord = await db.stripeAccount.create({
        data: {
          userId: user.id,
          stripeAccountId: stripeAcc.id,
        },
      });
    }

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountRecord.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/payouts?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/payouts?connected=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Stripe Connect error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/stripe/connect — get current Stripe Connect status
export async function GET() {
  try {
    const user = await requireUser();

    const stripeAccount = await db.stripeAccount.findUnique({
      where: { userId: user.id },
    });

    if (!stripeAccount) {
      return NextResponse.json({ connected: false });
    }

    // Refresh from Stripe
    const acct = await stripe.accounts.retrieve(stripeAccount.stripeAccountId);

    // Update DB
    await db.stripeAccount.update({
      where: { id: stripeAccount.id },
      data: {
        chargesEnabled: acct.charges_enabled ?? false,
        payoutsEnabled: acct.payouts_enabled ?? false,
        onboardingComplete: acct.details_submitted ?? false,
      },
    });

    return NextResponse.json({
      connected: true,
      chargesEnabled: acct.charges_enabled,
      payoutsEnabled: acct.payouts_enabled,
      onboardingComplete: acct.details_submitted,
      stripeAccountId: stripeAccount.stripeAccountId,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
