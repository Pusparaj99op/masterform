"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Link2, Code2, AlertTriangle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariants, backdropVariants } from "@/lib/motion";

interface MoreTabProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
}

export default function MoreTab({ eventId, eventSlug, eventTitle }: MoreTabProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(eventSlug);
  const [embedMode, setEmbedMode] = useState<"button" | "page">("button");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_URL ?? "https://eventflow.app"}/e/${slug}`;

  const embedButtonCode = `<a href="${publicUrl}" 
  style="display:inline-block;background:#5B5FEF;color:#fff;padding:10px 20px;border-radius:8px;font-family:sans-serif;text-decoration:none;font-weight:500;">
  Register for Event
</a>`;

  const embedPageCode = `<iframe 
  src="${publicUrl}" 
  width="100%" 
  height="700" 
  frameborder="0" 
  style="border-radius:12px;border:1px solid #2A2A32;">
</iframe>`;

  async function cloneEvent() {
    setCloning(true);
    const res = await fetch(`/api/events/${eventId}/clone`, { method: "POST" });
    if (res.ok) {
      const { event } = await res.json();
      router.push(`/events/${event.id}/overview`);
    }
    setCloning(false);
  }

  async function updateSlug() {
    await fetch(`/api/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  }

  async function cancelEvent() {
    if (confirmTitle !== eventTitle) return;
    setCancelling(true);
    await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    router.push("/events");
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      {/* Clone */}
      <div className="card p-5">
        <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Clone Event</h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Create a new event with the same information as this one. Everything except the guest list
          and event blasts will be copied over.
        </p>
        <button onClick={cloneEvent} disabled={cloning} className="btn btn-secondary">
          {cloning ? "Cloning..." : "Clone Event"}
        </button>
      </div>

      {/* Event URL */}
      <div className="card p-5">
        <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Event Page</h3>
        <div
          className="flex items-start gap-2 rounded-lg px-3 py-2 mb-4 text-xs"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "var(--accent-warning)",
          }}
        >
          <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
          <span>
            When you choose a new URL, the current one will no longer work.
            Don&apos;t change your URL if you&apos;ve already shared the event.
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center flex-1 input-base" style={{ padding: 0 }}>
            <span className="px-3 text-sm" style={{ color: "var(--text-muted)" }}>
              {typeof window !== "undefined" ? window.location.host : "eventflow.app"}/e/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm py-2.5 pr-3"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <button onClick={updateSlug} className="btn btn-secondary btn-sm px-4">
            Update
          </button>
        </div>
      </div>

      {/* Embed */}
      <div className="card p-5">
        <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Embed Event</h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Have your own site? Embed the event to let visitors know about it.
        </p>

        {/* Toggle */}
        <div
          className="flex rounded-lg overflow-hidden border mb-4 w-fit"
          style={{ borderColor: "var(--bg-border)" }}
        >
          {(["button", "page"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setEmbedMode(mode)}
              className="px-4 py-2 text-sm transition-colors capitalize"
              style={{
                background: embedMode === mode ? "var(--bg-elevated)" : "transparent",
                color: embedMode === mode ? "var(--text-primary)" : "var(--text-muted)",
                borderRight: mode === "button" ? "1px solid var(--bg-border)" : "none",
              }}
            >
              {mode === "button" ? "Button" : "Event Page"}
            </button>
          ))}
        </div>

        <div
          className="relative rounded-xl p-4 mb-3 font-mono text-xs overflow-x-auto"
          style={{
            background: "var(--bg-muted)",
            border: "1px solid var(--bg-border)",
            color: "var(--text-secondary)",
            whiteSpace: "pre",
          }}
        >
          {embedMode === "button" ? embedButtonCode : embedPageCode}
          <button
            onClick={() => copyCode(embedMode === "button" ? embedButtonCode : embedPageCode)}
            className="absolute top-3 right-3 btn btn-secondary btn-sm"
          >
            <Copy size={12} />
            {copyFeedback ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Preview */}
        {embedMode === "button" && (
          <div className="rounded-xl p-4" style={{ background: "var(--bg-muted)" }}>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Preview:</p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "var(--accent-primary)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontFamily: "sans-serif",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Register for Event
            </a>
          </div>
        )}
      </div>

      {/* Cancel */}
      <div className="card p-5" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
        <h3 className="font-semibold mb-1" style={{ color: "var(--accent-danger)" }}>Cancel Event</h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Cancel and permanently delete this event. This action can&apos;t be undone. Any registered
          guests will be notified and paid tickets will be refunded.
        </p>
        <button onClick={() => setShowCancelModal(true)} className="btn btn-danger btn-sm">
          <Trash2 size={14} />
          Cancel Event
        </button>
      </div>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {showCancelModal && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.7)" }}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setShowCancelModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="card p-6 w-full max-w-md"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Cancel &ldquo;{eventTitle}&rdquo;?
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                  This will permanently delete the event and notify all registered guests. Type the
                  event name to confirm.
                </p>
                <input
                  type="text"
                  placeholder={eventTitle}
                  value={confirmTitle}
                  onChange={(e) => setConfirmTitle(e.target.value)}
                  className="input-base mb-4"
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowCancelModal(false)} className="btn btn-secondary flex-1">
                    Keep Event
                  </button>
                  <button
                    onClick={cancelEvent}
                    disabled={confirmTitle !== eventTitle || cancelling}
                    className="btn btn-danger flex-1"
                  >
                    {cancelling ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
