import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { formatEventDateRange } from "@/lib/utils";
import { MapPin, Globe, Calendar, Users, Edit } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview | EventFlow" };

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await requireUser();
  const { eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      ticketTypes: true,
      _count: {
        select: {
          registrations: { where: { status: "GOING" } },
        },
      },
    },
  });

  if (!event || event.hostId !== user.id) notFound();

  const dateString = formatEventDateRange(event.startsAt, event.endsAt ?? null, event.timezone);
  const revenue = await db.registration.aggregate({
    where: { eventId, paymentStatus: "PAID" },
    _sum: { amountPaid: true },
  });

  const publicUrl = `${process.env.NEXT_PUBLIC_URL ?? ""}/e/${event.slug}`;

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {event.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <Calendar size={14} />
              {dateString}
            </span>
            {event.locationName && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <MapPin size={14} />
                {event.locationName}
              </span>
            )}
            {event.locationType === "ONLINE" && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Globe size={14} />
                Online
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="badge"
            style={{
              background: event.registrationStatus === "OPEN" ? "rgba(62,207,142,0.12)" : "rgba(239,68,68,0.1)",
              color: event.registrationStatus === "OPEN" ? "var(--accent-success)" : "var(--accent-danger)",
              border: "1px solid currentColor",
            }}
          >
            {event.registrationStatus}
          </span>
          <Link href={publicUrl} target="_blank" className="btn btn-secondary btn-sm">
            View Page →
          </Link>
        </div>
      </div>

      {/* Cover */}
      {event.coverImageUrl && (
        <div
          className="w-full h-48 rounded-2xl mb-6 overflow-hidden"
          style={{
            background: `url(${event.coverImageUrl}) center/cover`,
            border: "1px solid var(--bg-border)",
          }}
        />
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Going", value: event._count.registrations, color: "var(--accent-success)" },
          { label: "Capacity", value: event.capacity ?? "Unlimited", color: "var(--text-secondary)" },
          { label: "Revenue", value: `₹${(revenue._sum.amountPaid ?? 0).toLocaleString("en-IN")}`, color: "var(--accent-gold)" },
          { label: "Views", value: event.viewCount, color: "var(--accent-primary)" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1 tabular-nums" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Public URL */}
      <div className="card p-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          Public URL
        </p>
        <div className="flex items-center justify-between">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono"
            style={{ color: "var(--accent-primary)" }}
          >
            {publicUrl}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(publicUrl)}
            className="btn btn-secondary btn-sm"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Ticket types summary */}
      {event.ticketTypes.length > 0 && (
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Tickets
          </p>
          <div className="space-y-2">
            {event.ticketTypes.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--text-primary)" }}>{t.name}</span>
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--text-muted)" }}>
                    {t.quantitySold}{t.quantity ? `/${t.quantity}` : ""} sold
                  </span>
                  <span
                    style={{ color: t.price > 0 ? "var(--accent-gold)" : "var(--accent-success)" }}
                  >
                    {t.price > 0 ? `₹${t.price.toLocaleString("en-IN")}` : "Free"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
