import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import GuestsTab from "@/components/dashboard/tabs/GuestsTab";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Guests | EventFlow" };

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await requireUser();
  const { eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { id: true, hostId: true, capacity: true, title: true },
  });

  if (!event || event.hostId !== user.id) notFound();

  return <GuestsTab eventId={event.id} capacity={event.capacity} />;
}
