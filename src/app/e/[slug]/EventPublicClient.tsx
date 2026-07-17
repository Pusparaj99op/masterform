"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import {
  Calendar, MapPin, Globe, Users, ExternalLink, Link2, Share2
} from "lucide-react";
import { format } from "date-fns";
import { fadeUp, staggerContainer } from "@/lib/motion";

// Twitter/X icon (removed from lucide-react v1)
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}


interface EventData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  locationType: string;
  locationName: string | null;
  locationAddress: string | null;
  locationLat: number | null;
  locationLng: number | null;
  onlineUrl: string | null;
  registrationStatus: string;
  capacity: number | null;
  waitlistEnabled: boolean;
  host: { id: string; name: string | null; avatarUrl: string | null; twitterHandle: string | null; websiteUrl: string | null; bio: string | null };
  cohosts: Array<{ user: { id: string; name: string | null; avatarUrl: string | null } }>;
  ticketTypes: Array<{ id: string; name: string; price: number; currency: string; quantity: number | null; quantitySold: number; description: string | null }>;
  registrations: Array<{ id: string; guestName: string | null; user: { avatarUrl: string | null; name: string | null } | null }>;
  blasts: Array<{ id: string; body: string; sentAt: string }>;
  goingCount: number;
  dateString: string;
  isFree: boolean;
  minPrice: number;
}

export default function EventPublicClient({
  event,
  referralCode,
}: {
  event: EventData;
  referralCode?: string;
}) {
  const isClosed = event.registrationStatus === "CLOSED";
  const isOpen = event.registrationStatus === "OPEN";

  // Track pageview
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    fetch("/api/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        source: params.get("utm_source") ?? document.referrer ? "referral" : "direct",
      }),
    });
  }, [event.id]);

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      {/* ── COVER IMAGE ───────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ aspectRatio: "3/1", maxHeight: 400, overflow: "hidden" }}>
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.05)" }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-muted) 100%)",
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 30%, rgba(12,12,14,0.92) 100%)",
          }}
        />
        {/* Title on cover */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold leading-tight"
            style={{ color: "var(--text-primary)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            {event.title}
          </motion.h1>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Meta pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: "var(--text-secondary)" }}>
                <Calendar size={14} />
                {event.dateString}
              </span>
              {(event.locationName || event.locationAddress) && (
                <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: "var(--text-secondary)" }}>
                  <MapPin size={14} />
                  {event.locationName ?? event.locationAddress}
                </span>
              )}
              {event.locationType === "ONLINE" && (
                <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: "var(--text-secondary)" }}>
                  <Globe size={14} />
                  Online Event
                </span>
              )}
            </motion.div>

            {/* Hosted by */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Hosted by</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{
                    background: event.host.avatarUrl ? `url(${event.host.avatarUrl}) center/cover` : "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {!event.host.avatarUrl && (event.host.name?.[0]?.toUpperCase() ?? "H")}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{event.host.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {event.host.twitterHandle && (
                      <a href={`https://twitter.com/${event.host.twitterHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <XIcon size={11} />@{event.host.twitterHandle}
                      </a>
                    )}
                    {event.host.websiteUrl && (
                      <a href={event.host.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Link2 size={11} />Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Going count */}
            {event.goingCount > 0 && (
              <motion.div variants={fadeUp} className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {event.registrations.slice(0, 5).map((r, i) => (
                    <div
                      key={r.id}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold"
                      style={{
                        background: r.user?.avatarUrl ? `url(${r.user.avatarUrl}) center/cover` : "var(--bg-elevated)",
                        borderColor: "var(--bg-base)",
                        color: "var(--text-secondary)",
                        zIndex: 5 - i,
                      }}
                    >
                      {!r.user?.avatarUrl && (r.user?.name ?? r.guestName ?? "?")[0]?.toUpperCase()}
                    </div>
                  ))}
                </div>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{event.goingCount}</strong> going
                </span>
              </motion.div>
            )}

            {/* About */}
            {event.description && (
              <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>About</p>
                <div
                  className="prose-dark text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, "<br>") }}
                />
              </motion.div>
            )}

            {/* Location map */}
            {event.locationAddress && (
              <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Location</p>
                <div className="card p-4">
                  <div className="flex items-start gap-2.5 mb-3">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent-primary)" }} />
                    <div>
                      {event.locationName && (
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{event.locationName}</p>
                      )}
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{event.locationAddress}</p>
                    </div>
                  </div>
                  {event.locationLat && event.locationLng && (
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?q=${event.locationLat},${event.locationLng}&key=AIzaSyBFw0Qbyxkf1baTvkm-1bBkB7VHoajVEak`}
                      className="w-full rounded-xl"
                      style={{ height: 240, border: "1px solid var(--bg-border)" }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.locationAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs mt-3"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    <ExternalLink size={12} />
                    Open in Maps
                  </a>
                </div>
              </motion.div>
            )}

            {/* Public blasts */}
            {event.blasts.length > 0 && (
              <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Updates</p>
                <div className="space-y-3">
                  {event.blasts.map((blast) => (
                    <div key={blast.id} className="card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                        >
                          {event.host.name?.[0]?.toUpperCase() ?? "H"}
                        </div>
                        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{event.host.name}</span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          · {format(new Date(blast.sentAt), "MMM d")}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{blast.body}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── RIGHT COLUMN (sticky registration panel) ─────────────── */}
          <div className="lg:sticky lg:top-6 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="card p-5"
            >
              {isClosed ? (
                <>
                  <span className="badge badge-danger mb-4 block w-fit">Registration Closed</span>
                  {event.waitlistEnabled && (
                    <>
                      <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                        This event is full, but you can join the waitlist.
                      </p>
                      <Link href={`/e/${event.slug}/register?waitlist=1`} className="btn btn-secondary w-full justify-center">
                        Join Waitlist
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Ticket types */}
                  <div className="space-y-2 mb-4">
                    {event.ticketTypes.map((ticket) => {
                      const soldOut = ticket.quantity !== null && ticket.quantitySold >= ticket.quantity;
                      return (
                        <div
                          key={ticket.id}
                          className="flex items-center justify-between p-3 rounded-xl"
                          style={{
                            background: "var(--bg-muted)",
                            border: `1px solid ${ticket.price > 0 ? "rgba(212,168,83,0.2)" : "var(--bg-border)"}`,
                          }}
                        >
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {ticket.name}
                            </p>
                            {ticket.description && (
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ticket.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: ticket.price > 0 ? "var(--accent-gold)" : "var(--accent-success)" }}
                            >
                              {ticket.price > 0
                                ? `₹${ticket.price.toLocaleString("en-IN")}`
                                : "Free"}
                            </p>
                            {soldOut && (
                              <span className="text-xs" style={{ color: "var(--accent-danger)" }}>Sold Out</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href={`/e/${event.slug}/register${referralCode ? `?ref=${referralCode}` : ""}`}
                    className="btn btn-primary w-full justify-center btn-lg"
                  >
                    {event.isFree ? "Register — Free" : `Get Ticket — ₹${event.minPrice.toLocaleString("en-IN")}`}
                  </Link>

                  {event.capacity && (
                    <p className="text-xs text-center mt-3" style={{ color: "var(--text-muted)" }}>
                      {event.capacity - event.goingCount > 0
                        ? `${event.capacity - event.goingCount} spots remaining`
                        : "Event is full"}
                    </p>
                  )}
                </>
              )}

              {/* Share */}
              <div
                className="flex items-center justify-center gap-4 pt-4 mt-4 border-t"
                style={{ borderColor: "var(--bg-border)" }}
              >
                <button
                  onClick={() => navigator.share?.({ title: event.title, url: window.location.href })}
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Share2 size={13} />
                  Share
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <XIcon size={13} />
                  Tweet
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile CTA bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40 glass"
        style={{ borderTop: "1px solid var(--glass-border)" }}
      >
        <Link
          href={`/e/${event.slug}/register`}
          className="btn btn-primary w-full justify-center btn-lg"
        >
          {event.isFree ? "Register — Free" : `Get Ticket — ₹${event.minPrice.toLocaleString("en-IN")}`}
        </Link>
      </div>
    </div>
  );
}
