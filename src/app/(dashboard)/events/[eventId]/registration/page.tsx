import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import RegistrationTabClient from "./RegistrationTabClient";

export const metadata: Metadata = { title: "Registration | EventFlow" };

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await requireUser();
  const { eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      ticketTypes: { orderBy: { sortOrder: "asc" } },
      regQuestions: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!event || event.hostId !== user.id) notFound();

  return (
    <RegistrationTabClient
      event={{
        id: event.id,
        registrationStatus: event.registrationStatus,
        capacity: event.capacity,
        waitlistEnabled: event.waitlistEnabled,
        requiresApproval: event.requiresApproval,
        groupRegistration: event.groupRegistration,
        ticketTypes: event.ticketTypes,
        regQuestions: event.regQuestions,
      }}
    />
  );
}
