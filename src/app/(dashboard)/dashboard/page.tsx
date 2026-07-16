import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { CalendarDays, Users, CreditCard, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { formatEventDateRange } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | EventFlow",
};

async function getDashboardData(userId: string) {
  const [events, totalRegistrations, revenue] = await Promise.all([
    db.event.findMany({
      where: { hostId: userId },
      orderBy: { startsAt: "asc" },
      take: 6,
      include: {
        _count: { select: { registrations: { where: { status: "GOING" } } } },
        ticketTypes: { select: { price: true } },
      },
    }),
    db.registration.count({ where: { event: { hostId: userId }, status: "GOING" } }),
    db.registration.aggregate({
      where: { event: { hostId: userId }, paymentStatus: "PAID" },
      _sum: { amountPaid: true },
    }),
  ]);

  const upcoming = events.filter((e) => e.startsAt > new Date());
  const past = events.filter((e) => e.startsAt <= new Date());

  return { events, upcoming, past, totalRegistrations, revenue: revenue._sum.amountPaid ?? 0 };
}

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");

  const { events, upcoming, totalRegistrations, revenue } = await getDashboardData(user.id);

  const stats = [
    { label: "Total Events", value: events.length, icon: CalendarDays, color: "var(--accent-primary)" },
    { label: "Total Registrations", value: totalRegistrations, icon: Users, color: "var(--accent-success)" },
    {
      label: "Revenue Collected",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      icon: CreditCard,
      color: "var(--accent-gold)",
    },
    { label: "Upcoming", value: upcoming.length, icon: TrendingUp, color: "var(--accent-warning)" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Here&apos;s what&apos;s happening with your events.
          </p>
        </div>
        <Link href="/events/new" className="btn btn-primary">
          <Plus size={16} />
          New Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}18` }}
              >
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Upcoming Events
          </h2>
          <Link
            href="/events"
            className="flex items-center gap-1 text-sm"
            style={{ color: "var(--accent-primary)" }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div
            className="card p-12 text-center"
            style={{ borderStyle: "dashed" }}
          >
            <CalendarDays size={32} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <p className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              No upcoming events
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Create your first event to get started.
            </p>
            <Link href="/events/new" className="btn btn-primary btn-sm inline-flex">
              <Plus size={14} /> Create Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((event) => (
              <Link key={event.id} href={`/events/${event.id}/overview`}>
                <div className="card hover:-translate-y-0.5 transition-transform cursor-pointer overflow-hidden">
                  {/* Cover */}
                  <div
                    className="h-28 w-full"
                    style={{
                      background: event.coverImageUrl
                        ? `url(${event.coverImageUrl}) center/cover`
                        : "linear-gradient(135deg, var(--bg-elevated), var(--bg-muted))",
                    }}
                  />
                  <div className="p-4">
                    <p className="font-semibold text-sm mb-1 truncate" style={{ color: "var(--text-primary)" }}>
                      {event.title}
                    </p>
                    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                      {formatEventDateRange(event.startsAt, event.endsAt ?? null, event.timezone)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="badge badge-success text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {event._count.registrations} Going
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {event.ticketTypes.some((t) => t.price > 0)
                          ? `₹${Math.min(...event.ticketTypes.filter((t) => t.price > 0).map((t) => t.price)).toLocaleString("en-IN")}`
                          : "Free"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
