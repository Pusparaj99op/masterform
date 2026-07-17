import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import RegisterPageClient from "./RegisterPageClient";
import { formatEventDateRange } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Register | EventFlow" };

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await db.event.findUnique({
    where: { slug, visibility: "PUBLIC" },
    include: {
      ticketTypes: { where: { isVisible: true }, orderBy: { sortOrder: "asc" } },
      regQuestions: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!event) notFound();

  if (event.registrationStatus === "CLOSED") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="text-center">
          <span className="badge badge-danger mb-4 block mx-auto w-fit text-sm">Registration Closed</span>
          <p style={{ color: "var(--text-secondary)" }}>Registration for this event has closed.</p>
        </div>
      </div>
    );
  }

  const dateString = formatEventDateRange(event.startsAt, event.endsAt ?? null, event.timezone);

  return (
    <RegisterPageClient
      event={{
        id: event.id,
        slug: event.slug,
        title: event.title,
        startsAt: event.startsAt.toISOString(),
        dateString,
        ticketTypes: event.ticketTypes,
        regQuestions: event.regQuestions,
        requireApproval: event.requiresApproval,
      }}
    />
  );
}
