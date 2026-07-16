import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import SuccessPageClient from "./SuccessPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Registration Confirmed | EventFlow" };

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reg?: string; session_id?: string }>;
}) {
  const { slug } = await params;
  const { reg, session_id } = await searchParams;

  const event = await db.event.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      startsAt: true,
      endsAt: true,
      timezone: true,
      locationAddress: true,
      description: true,
    },
  });

  if (!event) notFound();

  let registration = null;

  if (reg) {
    registration = await db.registration.findUnique({
      where: { id: reg },
      select: { id: true, referralCode: true, status: true, guestName: true },
    });
  } else if (session_id) {
    registration = await db.registration.findFirst({
      where: { stripeSessionId: session_id },
      select: { id: true, referralCode: true, status: true, guestName: true },
    });
  }

  return (
    <SuccessPageClient
      event={{
        ...event,
        startsAt: event.startsAt.toISOString(),
        endsAt: event.endsAt?.toISOString() ?? null,
      }}
      registration={registration}
    />
  );
}
