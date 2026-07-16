"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Bell } from "lucide-react";
import { format } from "date-fns";

interface Blast {
  id: string;
  subject: string | null;
  body: string;
  sentTo: string;
  sentAt: string;
  recipientCount: number;
}

interface BlastsTabProps {
  eventId: string;
  initialBlasts: Blast[];
  hostAvatarUrl?: string | null;
  hostName?: string | null;
}

export default function BlastsTab({
  eventId,
  initialBlasts,
  hostAvatarUrl,
  hostName,
}: BlastsTabProps) {
  const [blasts, setBlasts] = useState<Blast[]>(initialBlasts);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [sentTo, setSentTo] = useState<"GOING" | "ALL" | "WAITLISTED">("GOING");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function sendBlast() {
    if (!body.trim()) return;
    setSending(true);
    setError("");

    const res = await fetch(`/api/events/${eventId}/blast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: subject || undefined, body, sentTo }),
    });

    const data = await res.json();

    if (res.ok) {
      setBlasts([data.blast, ...blasts]);
      setBody("");
      setSubject("");
    } else {
      setError(data.error ?? "Failed to send blast");
    }
    setSending(false);
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Composer */}
      <div className="card p-4 mb-6">
        <div className="flex gap-3">
          <div
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm"
            style={{
              background: hostAvatarUrl ? `url(${hostAvatarUrl}) center/cover` : "var(--bg-elevated)",
              color: "var(--text-secondary)",
            }}
          >
            {!hostAvatarUrl && (hostName?.[0]?.toUpperCase() ?? "H")}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Subject (optional)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-transparent text-sm border-none outline-none mb-2 font-medium"
              style={{ color: "var(--text-primary)" }}
            />
            <textarea
              placeholder="Send a blast to your guests..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full bg-transparent text-sm border-none outline-none resize-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>

        <div
          className="flex items-center justify-between mt-3 pt-3 border-t"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Send to:</span>
            <select
              value={sentTo}
              onChange={(e) => setSentTo(e.target.value as typeof sentTo)}
              className="text-xs border rounded-lg px-2 py-1"
              style={{
                background: "var(--bg-muted)",
                borderColor: "var(--bg-border)",
                color: "var(--text-secondary)",
              }}
            >
              <option value="GOING">Going</option>
              <option value="ALL">All Guests</option>
              <option value="WAITLISTED">Waitlisted</option>
            </select>
          </div>
          <button
            onClick={sendBlast}
            disabled={!body.trim() || sending}
            className="btn btn-primary btn-sm"
          >
            <Send size={13} />
            {sending ? "Sending..." : "Send Blast"}
          </button>
        </div>

        {error && (
          <p className="text-xs mt-2" style={{ color: "var(--accent-danger)" }}>
            {error}
          </p>
        )}
      </div>

      {/* System messages */}
      <div className="card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          System Messages
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell size={15} style={{ color: "var(--accent-primary)" }} />
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>Event Reminders</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Sent 1 day and 1 hour before event
                </p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm">Manage</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail size={15} style={{ color: "var(--accent-gold)" }} />
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>Post-Event Feedback</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Schedule a feedback email after the event
                </p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm">Schedule</button>
          </div>
        </div>
      </div>

      {/* Sent blasts */}
      {blasts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            Sent
          </h3>
          <div className="space-y-3">
            {blasts.map((blast) => (
              <motion.div
                key={blast.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    {hostName?.[0]?.toUpperCase() ?? "H"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {hostName ?? "Host"}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {format(new Date(blast.sentAt), "MMM d 'at' h:mm a")}
                      </span>
                    </div>
                    {blast.subject && (
                      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                        {blast.subject}
                      </p>
                    )}
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {blast.body}
                    </p>
                    <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                      Sent to: {blast.sentTo.charAt(0) + blast.sentTo.slice(1).toLowerCase()} ·{" "}
                      {blast.recipientCount} recipients
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {blasts.length === 0 && (
        <div className="py-12 text-center">
          <Send size={28} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No blasts sent yet. Write a message above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
