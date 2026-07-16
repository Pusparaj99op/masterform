import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, CalendarDays, MapPin, Users } from "lucide-react";
import { formatEventDateRange } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Events | EventFlow" };

export default async function EventsListPage() {
  const user = await requireUser();

  const events = await db.event.findMany({
    where: { hostId: user.id },
    orderBy: { startsAt: "desc" },
    include: {
      _count: { select: { registrations: { where: { status: "GOING" } } } },
      ticketTypes: { select: { price: true } },
    },
  });

  const upcoming = events.filter((e) => e.startsAt > new Date());
  const past = events.filter((e) => e.startsAt <= new Date());

  function EventRow({ event }: { event: (typeof events)[0] }) {
    const isFree = event.ticketTypes.every((t) => t.price === 0);
    const minPrice = isFree ? 0 : Math.min(...event.ticketTypes.filter((t) => t.price > 0).map((t) => t.price));
    return (
      <Link href={`/events/${event.id}/overview`} className="flex items-center gap-4 p-4 hover:bg-[var(--bg-elevated)] transition-colors rounded-xl cursor-pointer">
        <div
          className="w-14 h-14 rounded-xl flex-shrink-0"
          style={{
            background: event.coverImageUrl ? `url(${event.coverImageUrl}) center/cover` : "var(--bg-elevated)",
            border: "1px solid var(--bg-border)",
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{event.title}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <CalendarDays size={11} />
              {new Date(event.startsAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </span>
            {event.locationName && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <MapPin size={11} />{event.locationName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Users size={14} />{event._count.registrations}
          </span>
          <span className="badge" style={{
            background: isFree ? "rgba(62,207,142,0.12)" : "var(--accent-gold-dim)",
            color: isFree ? "var(--accent-success)" : "var(--accent-gold)",
            border: `1px solid ${isFree ? "rgba(62,207,142,0.25)" : "rgba(212,168,83,0.25)"}`,
          }}>
            {isFree ? "Free" : `₹${minPrice.toLocaleString("en-IN")}`}
          </span>
          <span
            className="badge"
            style={{
              background: event.registrationStatus === "OPEN" ? "rgba(62,207,142,0.12)" : "rgba(239,68,68,0.1)",
              color: event.registrationStatus === "OPEN" ? "var(--accent-success)" : "var(--accent-danger)",
            }}
          >
            {event.registrationStatus === "OPEN" ? "Open" : "Closed"}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Events</h1>
        <Link href="/events/new" className="btn btn-primary btn-sm">
          <Plus size={15} />New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card p-16 text-center" style={{ borderStyle: "dashed" }}>
          <CalendarDays size={40} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No events yet</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Create your first event to get started.</p>
          <Link href="/events/new" className="btn btn-primary inline-flex"><Plus size={15} />Create Event</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Upcoming</p>
              <div className="card overflow-hidden divide-y" style={{ borderColor: "var(--bg-border)" }}>
                {upcoming.map((e) => <EventRow key={e.id} event={e} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Past</p>
              <div className="card overflow-hidden divide-y" style={{ borderColor: "var(--bg-border)", opacity: 0.7 }}>
                {past.map((e) => <EventRow key={e.id} event={e} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
