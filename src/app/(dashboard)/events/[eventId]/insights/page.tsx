import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import InsightsTab from "@/components/dashboard/tabs/InsightsTab";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Insights | EventFlow" };

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await requireUser();
  const { eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      pageViews: { select: { viewedAt: true, source: true }, orderBy: { viewedAt: "asc" } },
      _count: {
        select: {
          registrations: { where: { status: "GOING" } },
        },
      },
    },
  });

  if (!event || event.hostId !== user.id) notFound();

  const revenue = await db.registration.aggregate({
    where: { eventId, paymentStatus: "PAID" },
    _sum: { amountPaid: true },
  });

  return (
    <InsightsTab
      pageViews={event.pageViews.map((v) => ({
        viewedAt: v.viewedAt.toISOString(),
        source: v.source ?? undefined,
      }))}
      totalRegistrations={event._count.registrations}
      revenue={revenue._sum.amountPaid ?? 0}
      eventId={eventId}
    />
  );
}
