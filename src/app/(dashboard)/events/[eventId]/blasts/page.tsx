import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import BlastsTab from "@/components/dashboard/tabs/BlastsTab";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blasts | EventFlow" };

export default async function BlastsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await requireUser();
  const { eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      blasts: { orderBy: { sentAt: "desc" }, take: 20 },
      host: { select: { name: true, avatarUrl: true } },
    },
  });

  if (!event || event.hostId !== user.id) notFound();

  const serializedBlasts = event.blasts.map((b) => ({
    ...b,
    sentAt: b.sentAt.toISOString(),
  }));

  return (
    <BlastsTab
      eventId={eventId}
      initialBlasts={serializedBlasts}
      hostName={user.name}
      hostAvatarUrl={user.avatarUrl}
    />
  );
}
