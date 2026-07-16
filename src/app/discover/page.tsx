import { db } from "@/lib/db";
import Link from "next/link";
import { formatEventDateRange } from "@/lib/utils";
import { MapPin, Globe, Search, Filter } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Events | EventFlow",
  description: "Discover upcoming events near you. Register for free or paid events in seconds.",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;

  const events = await db.event.findMany({
    where: {
      visibility: "PUBLIC",
      registrationStatus: "OPEN",
      startsAt: { gte: new Date() },
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { locationName: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(type === "free" ? { ticketTypes: { every: { price: 0 } } } : {}),
      ...(type === "paid" ? { ticketTypes: { some: { price: { gt: 0 } } } } : {}),
      ...(type === "online" ? { locationType: "ONLINE" } : {}),
    },
    orderBy: { startsAt: "asc" },
    take: 24,
    include: {
      host: { select: { name: true, avatarUrl: true } },
      ticketTypes: { select: { price: true } },
      _count: { select: { registrations: { where: { status: "GOING" } } } },
    },
  });

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <MarketingNav />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-20">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Discover Events
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Find and join events happening near you or online
          </p>
        </div>

        {/* Search + filters */}
        <form className="flex flex-col sm:flex-row gap-3 mb-8">
          <div
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
            }}
          >
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search events, venues, cities..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: "", label: "All" },
              { value: "free", label: "Free" },
              { value: "paid", label: "Paid" },
              { value: "online", label: "Online" },
            ].map((f) => (
              <Link
                key={f.value}
                href={f.value ? `/discover?type=${f.value}${q ? `&q=${q}` : ""}` : "/discover"}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background:
                    type === f.value || (!type && !f.value)
                      ? "var(--accent-primary)"
                      : "var(--bg-surface)",
                  color:
                    type === f.value || (!type && !f.value)
                      ? "#fff"
                      : "var(--text-secondary)",
                  border: "1px solid var(--bg-border)",
                }}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </form>

        {/* Grid */}
        {events.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              No events found
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              {q ? `No results for "${q}". Try a different search.` : "No upcoming public events right now."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {events.map((event) => {
              const isFree = event.ticketTypes.every((t) => t.price === 0);
              const minPrice = isFree
                ? 0
                : Math.min(...event.ticketTypes.filter((t) => t.price > 0).map((t) => t.price));
              const dateStr = formatEventDateRange(event.startsAt, null, event.timezone);

              return (
                <Link key={event.id} href={`/e/${event.slug}`}>
                  <article className="card overflow-hidden hover:-translate-y-1 transition-transform group cursor-pointer h-full flex flex-col">
                    {/* Cover */}
                    <div
                      className="h-40 w-full flex-shrink-0 relative overflow-hidden"
                      style={{
                        background: event.coverImageUrl
                          ? `url(${event.coverImageUrl}) center/cover`
                          : "linear-gradient(135deg, var(--bg-elevated), var(--bg-muted))",
                      }}
                    >
                      {/* Price badge */}
                      <span
                        className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: isFree ? "rgba(62,207,142,0.15)" : "rgba(212,168,83,0.15)",
                          color: isFree ? "var(--accent-success)" : "var(--accent-gold)",
                          backdropFilter: "blur(8px)",
                          border: `1px solid ${isFree ? "rgba(62,207,142,0.3)" : "rgba(212,168,83,0.3)"}`,
                        }}
                      >
                        {isFree ? "Free" : `₹${minPrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs mb-2" style={{ color: "var(--accent-primary)" }}>
                        {dateStr}
                      </p>
                      <h2 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: "var(--text-primary)" }}>
                        {event.title}
                      </h2>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full flex-shrink-0"
                            style={{
                              background: event.host.avatarUrl
                                ? `url(${event.host.avatarUrl}) center/cover`
                                : "var(--bg-elevated)",
                            }}
                          />
                          <span className="text-xs truncate max-w-[100px]" style={{ color: "var(--text-muted)" }}>
                            {event.host.name ?? "Organizer"}
                          </span>
                        </div>
                        {event.locationName ? (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                            <MapPin size={10} />
                            <span className="truncate max-w-[80px]">{event.locationName}</span>
                          </span>
                        ) : event.locationType === "ONLINE" ? (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                            <Globe size={10} /> Online
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
