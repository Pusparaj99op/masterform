import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import MoreTab from "@/components/dashboard/tabs/MoreTab";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "More | EventFlow" };

export default async function MorePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await requireUser();
  const { eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { id: true, hostId: true, slug: true, title: true },
  });

  if (!event || event.hostId !== user.id) notFound();

  return (
    <MoreTab
      eventId={event.id}
      eventSlug={event.slug}
      eventTitle={event.title}
    />
  );
}
