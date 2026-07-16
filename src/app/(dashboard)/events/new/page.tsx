"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { Check, ChevronRight, Image, Calendar, MapPin, Ticket, Settings, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Basics", icon: Image, desc: "Title, cover, description" },
  { id: 2, label: "When", icon: Calendar, desc: "Date, time, timezone" },
  { id: 3, label: "Where", icon: MapPin, desc: "Location or online" },
  { id: 4, label: "Tickets", icon: Ticket, desc: "Free or paid tickets" },
  { id: 5, label: "Settings", icon: Settings, desc: "Capacity, approval" },
  { id: 6, label: "Publish", icon: Eye, desc: "Review and publish" },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImageUrl: "",
    startsAt: "",
    endsAt: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locationType: "IN_PERSON" as "IN_PERSON" | "ONLINE" | "HYBRID",
    locationName: "",
    locationAddress: "",
    onlineUrl: "",
    capacity: "",
    requireApproval: false,
    waitlistEnabled: true,
    visibility: "PUBLIC" as "PUBLIC" | "PRIVATE",
    ticketName: "General Admission",
    ticketPrice: "0",
    ticketQuantity: "",
  });

  function update(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(publish: boolean) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          coverImageUrl: form.coverImageUrl || undefined,
          startsAt: form.startsAt,
          endsAt: form.endsAt || undefined,
          timezone: form.timezone,
          locationType: form.locationType,
          locationName: form.locationName || undefined,
          locationAddress: form.locationAddress || undefined,
          onlineUrl: form.onlineUrl || undefined,
          capacity: form.capacity ? parseInt(form.capacity) : undefined,
          requireApproval: form.requireApproval,
          waitlistEnabled: form.waitlistEnabled,
          visibility: publish ? "PUBLIC" : "PRIVATE",
        }),
      });

      if (res.ok) {
        const event = await res.json();

        // Create default ticket type
        if (form.ticketName) {
          await fetch(`/api/events/${event.id}/tickets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.ticketName,
              price: parseFloat(form.ticketPrice) || 0,
              quantity: form.ticketQuantity ? parseInt(form.ticketQuantity) : null,
            }),
          });
        }

        router.push(`/events/${event.id}/overview`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => step > s.id && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                step === s.id
                  ? "bg-[var(--accent-primary)] text-white"
                  : step > s.id
                  ? "bg-[var(--bg-elevated)] text-[var(--text-secondary)] cursor-pointer"
                  : "bg-transparent text-[var(--text-muted)] cursor-default"
              )}
            >
              {step > s.id ? <Check size={12} /> : <s.icon size={12} />}
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className="w-4 h-px flex-shrink-0"
                style={{ background: step > s.id ? "var(--accent-primary)" : "var(--bg-border)" }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Basics</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Event Title *</label>
              <input type="text" className="input-base" placeholder="My Awesome Event" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Cover Image URL</label>
              <input type="url" className="input-base" placeholder="https://..." value={form.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} />
              {form.coverImageUrl && (
                <img src={form.coverImageUrl} alt="Cover preview" className="w-full h-40 object-cover rounded-xl mt-2" style={{ border: "1px solid var(--bg-border)" }} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description</label>
              <textarea
                className="input-base"
                rows={5}
                placeholder="Describe your event..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>When</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Start Date & Time *</label>
                <input type="datetime-local" className="input-base" value={form.startsAt} onChange={(e) => update("startsAt", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>End Date & Time</label>
                <input type="datetime-local" className="input-base" value={form.endsAt} onChange={(e) => update("endsAt", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Timezone</label>
              <select className="input-base" value={form.timezone} onChange={(e) => update("timezone", e.target.value)}>
                {Intl.supportedValuesOf("timeZone").map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Where</h2>
            <div className="flex gap-2">
              {(["IN_PERSON", "ONLINE", "HYBRID"] as const).map((lt) => (
                <button
                  key={lt}
                  onClick={() => update("locationType", lt)}
                  className={cn("flex-1 py-2.5 text-sm rounded-xl border transition-colors",
                    form.locationType === lt
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                      : "border-[var(--bg-border)] text-[var(--text-muted)]")}
                >
                  {lt === "IN_PERSON" ? "In Person" : lt === "ONLINE" ? "Online" : "Hybrid"}
                </button>
              ))}
            </div>
            {form.locationType !== "ONLINE" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Venue Name</label>
                  <input type="text" className="input-base" placeholder="e.g. Cafe De Sana" value={form.locationName} onChange={(e) => update("locationName", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Full Address</label>
                  <input type="text" className="input-base" placeholder="123 Main St, City" value={form.locationAddress} onChange={(e) => update("locationAddress", e.target.value)} />
                </div>
              </>
            )}
            {form.locationType !== "IN_PERSON" && (
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Online Link (revealed after registration)</label>
                <input type="url" className="input-base" placeholder="https://zoom.us/j/..." value={form.onlineUrl} onChange={(e) => update("onlineUrl", e.target.value)} />
              </div>
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Tickets</h2>
            <div className="card p-4">
              <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Default Ticket Type</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Ticket Name</label>
                  <input type="text" className="input-base" value={form.ticketName} onChange={(e) => update("ticketName", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Price (₹) — 0 = Free</label>
                    <input type="number" min="0" step="1" className="input-base" value={form.ticketPrice} onChange={(e) => update("ticketPrice", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Quantity (leave blank = unlimited)</label>
                    <input type="number" min="1" className="input-base" placeholder="∞" value={form.ticketQuantity} onChange={(e) => update("ticketQuantity", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            {parseFloat(form.ticketPrice) > 0 && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: "rgba(91,95,239,0.08)", border: "1px solid rgba(91,95,239,0.2)" }}>
                <span className="text-xs" style={{ color: "var(--accent-primary)" }}>
                  ⚡ You&apos;ll need to connect Stripe to accept payments. Go to Payouts in settings after creating the event.
                </span>
              </div>
            )}
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Capacity (leave blank = unlimited)</label>
              <input type="number" min="1" className="input-base" placeholder="∞" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} />
            </div>
            <div className="space-y-3">
              {[
                { key: "requireApproval", label: "Require Approval", desc: "Manually approve each registration" },
                { key: "waitlistEnabled", label: "Enable Waitlist", desc: "Allow guests to join waitlist when full" },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center justify-between p-3 card">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
                  </div>
                  <button
                    onClick={() => update(opt.key, !form[opt.key as keyof typeof form])}
                    className="w-11 h-6 rounded-full relative transition-colors"
                    style={{
                      background: form[opt.key as keyof typeof form] ? "var(--accent-primary)" : "var(--bg-muted)",
                    }}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white"
                      animate={{ left: form[opt.key as keyof typeof form] ? "calc(100% - 20px)" : 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="step6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Review & Publish</h2>
            <div className="card p-5 space-y-3">
              {[
                { label: "Title", value: form.title || "—" },
                { label: "Date", value: form.startsAt ? new Date(form.startsAt).toLocaleString("en-IN") : "—" },
                { label: "Location", value: form.locationType === "ONLINE" ? "Online" : (form.locationName || form.locationAddress || "—") },
                { label: "Ticket", value: `${form.ticketName} — ${parseFloat(form.ticketPrice) > 0 ? `₹${parseFloat(form.ticketPrice).toLocaleString("en-IN")}` : "Free"}` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                  <span style={{ color: "var(--text-primary)" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => submit(false)} disabled={submitting || !form.title || !form.startsAt} className="btn btn-secondary flex-1">
                Save as Draft
              </button>
              <button onClick={() => submit(true)} disabled={submitting || !form.title || !form.startsAt} className="btn btn-primary flex-1">
                {submitting ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => step > 1 && setStep(s => s - 1)}
          disabled={step === 1}
          className="btn btn-ghost disabled:opacity-0"
        >
          ← Back
        </button>
        {step < 6 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && !form.title}
            className="btn btn-primary"
          >
            Continue <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
