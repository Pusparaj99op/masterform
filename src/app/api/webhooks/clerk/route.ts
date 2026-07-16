import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

/**
 * Manual Svix webhook verification without the svix package.
 * Clerk uses Svix which signs with HMAC-SHA256 over:
 *   `${svix_id}.${svix_timestamp}.${rawBody}`
 */
function verifySvixSignature(
  rawBody: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  secret: string
): boolean {
  // The secret is prefixed with "whsec_" then base64-encoded
  const secretBytes = Buffer.from(
    secret.startsWith("whsec_") ? secret.slice(6) : secret,
    "base64"
  );

  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const hmac = createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  // svix_signature can be comma-separated list of "v1,<base64>" signatures
  const signatures = svixSignature.split(" ");
  for (const sig of signatures) {
    const parts = sig.split(",");
    const b64 = parts[parts.length - 1];
    if (!b64) continue;
    try {
      if (timingSafeEqual(Buffer.from(hmac), Buffer.from(b64))) return true;
    } catch {
      // length mismatch — skip
    }
  }
  return false;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const headersList = await headers();

  const svixId = headersList.get("svix-id") ?? "";
  const svixTimestamp = headersList.get("svix-timestamp") ?? "";
  const svixSignature = headersList.get("svix-signature") ?? "";

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  const valid = verifySvixSignature(rawBody, svixId, svixTimestamp, svixSignature, secret);
  if (!valid) {
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  let event: ClerkWebhookEvent;
  try {
    event = JSON.parse(rawBody) as ClerkWebhookEvent;
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    const email = data.email_addresses[0]?.email_address;
    if (!email) return NextResponse.json({ received: true });

    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

    await db.user.upsert({
      where: { clerkId: data.id },
      create: { clerkId: data.id, email, name, avatarUrl: data.image_url ?? null },
      update: { email, name, avatarUrl: data.image_url ?? null },
    });
  }

  if (type === "user.deleted") {
    await db.user.deleteMany({ where: { clerkId: data.id } });
  }

  return NextResponse.json({ received: true });
}
