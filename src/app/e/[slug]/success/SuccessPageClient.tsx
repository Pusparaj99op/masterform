"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Copy, Share2, CheckCircle } from "lucide-react";
import QRCode from "react-qr-code";
import { googleCalendarUrl, generateICS } from "@/lib/utils";
import { checkmarkVariants } from "@/lib/motion";

interface SuccessPageClientProps {
  event: {
    id: string;
    slug: string;
    title: string;
    startsAt: string;
    endsAt: string | null;
    timezone: string;
    locationAddress: string | null;
    description: string | null;
  };
  registration: {
    id: string;
    referralCode: string;
    status: string;
    guestName: string | null;
  } | null;
}

export default function SuccessPageClient({ event, registration }: SuccessPageClientProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = registration
    ? `${process.env.NEXT_PUBLIC_URL ?? "https://eventflow.app"}/e/${event.slug}?ref=${registration.referralCode}`
    : "";

  const gcalUrl = googleCalendarUrl({
    title: event.title,
    startsAt: new Date(event.startsAt),
    endsAt: event.endsAt ? new Date(event.endsAt) : null,
    locationAddress: event.locationAddress,
    description: event.description,
  });

  function downloadICS() {
    const ics = generateICS({
      title: event.title,
      description: event.description,
      startsAt: new Date(event.startsAt),
      endsAt: event.endsAt ? new Date(event.endsAt) : null,
      locationAddress: event.locationAddress,
      slug: event.slug,
    });
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}.ics`;
    a.click();
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const isWaitlisted = registration?.status === "WAITLISTED";
  const isPending = registration?.status === "PENDING_APPROVAL";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="w-full max-w-md">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: isWaitlisted
              ? "rgba(245,158,11,0.15)"
              : isPending
              ? "rgba(91,95,239,0.15)"
              : "rgba(62,207,142,0.15)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <motion.path
              d={isWaitlisted ? "M18 8 L18 18 M18 24 L18 24" : "M8 18 L15 25 L28 11"}
              stroke={isWaitlisted ? "var(--accent-warning)" : isPending ? "var(--accent-primary)" : "var(--accent-success)"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkVariants}
              initial="hidden"
              animate="visible"
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {isWaitlisted
              ? "You're on the waitlist!"
              : isPending
              ? "Request submitted!"
              : "You're registered! 🎉"}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {isWaitlisted
              ? "We'll notify you if a spot opens up."
              : isPending
              ? "The organizer will review your request."
              : `See you at ${event.title}`}
          </p>
        </motion.div>

        {/* Event summary card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-4 mb-4"
        >
          <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{event.title}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(event.startsAt).toLocaleDateString("en-IN", {
              weekday: "long", month: "long", day: "numeric", year: "numeric",
              timeZone: event.timezone,
            })}
          </p>
        </motion.div>

        {/* QR Code ticket */}
        {registration && !isWaitlisted && !isPending && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-5 mb-4 flex flex-col items-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              Your Ticket
            </p>
            <div className="p-3 rounded-xl bg-white mb-2">
              <QRCode
                value={registration.id}
                size={140}
                bgColor="#ffffff"
                fgColor="#0C0C0E"
              />
            </div>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {registration.id.slice(0, 8).toUpperCase()}
            </p>
          </motion.div>
        )}

        {/* Calendar buttons */}
        {!isWaitlisted && !isPending && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex gap-2 mb-4"
          >
            <a href={gcalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex-1 justify-center text-xs">
              <Calendar size={14} />
              Google Calendar
            </a>
            <button onClick={downloadICS} className="btn btn-secondary flex-1 justify-center text-xs">
              <Calendar size={14} />
              Apple Calendar
            </button>
          </motion.div>
        )}

        {/* Referral section */}
        {registration && !isWaitlisted && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-4 mb-4"
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Invite friends
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              Share your unique invite link with friends.
            </p>
            <div className="flex gap-2">
              <div
                className="flex-1 text-xs px-3 py-2 rounded-lg font-mono truncate"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--bg-border)",
                  color: "var(--text-secondary)",
                }}
              >
                {referralUrl}
              </div>
              <button onClick={copyReferralLink} className="btn btn-secondary btn-sm">
                <Copy size={13} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Join me at ${event.title}! ${referralUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm flex-1 justify-center text-xs"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Joining ${event.title} — come with me!`)}&url=${encodeURIComponent(referralUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm flex-1 justify-center text-xs"
              >
                Tweet
              </a>
            </div>
          </motion.div>
        )}

        {/* View event */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <Link href={`/e/${event.slug}`} className="btn btn-ghost w-full justify-center text-sm">
            ← View Event Page
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
