"use client";
import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number | null;
  quantitySold: number;
  description: string | null;
}

interface RegQuestion {
  id: string;
  label: string;
  type: string;
  isRequired: boolean;
}

interface Event {
  id: string;
  registrationStatus: string;
  capacity: number | null;
  waitlistEnabled: boolean;
  requireApproval: boolean;
  groupRegistration: boolean;
  ticketTypes: TicketType[];
  regQuestions: RegQuestion[];
}

export default function RegistrationTabClient({ event }: { event: Event }) {
  const [form, setForm] = useState({
    registrationStatus: event.registrationStatus,
    capacity: event.capacity?.toString() ?? "",
    waitlistEnabled: event.waitlistEnabled,
    requireApproval: event.requireApproval,
    groupRegistration: event.groupRegistration,
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  async function save() {
    setSaving(true);
    await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationStatus: form.registrationStatus,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        waitlistEnabled: form.waitlistEnabled,
        requireApproval: form.requireApproval,
        groupRegistration: form.groupRegistration,
      }),
    });
    setSaving(false);
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 2000);
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      {/* Registration Status */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Registration Status</h3>
        <div className="grid grid-cols-3 gap-2">
          {["OPEN", "CLOSED", "WAITLIST_ONLY"].map((s) => (
            <button
              key={s}
              onClick={() => setForm((f) => ({ ...f, registrationStatus: s }))}
              className="p-3 rounded-xl text-sm font-medium border transition-all"
              style={{
                background: form.registrationStatus === s ? "var(--accent-primary)" : "var(--bg-muted)",
                borderColor: form.registrationStatus === s ? "var(--accent-primary)" : "var(--bg-border)",
                color: form.registrationStatus === s ? "#fff" : "var(--text-secondary)",
              }}
            >
              {s === "WAITLIST_ONLY" ? "Waitlist Only" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Options</h3>
        <div className="space-y-1">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Capacity (leave blank = unlimited)
            </label>
            <input
              type="number"
              min="1"
              className="input-base"
              placeholder="∞ Unlimited"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-3 mt-4">
          {[
            { key: "requireApproval", label: "Require approval", desc: "Manually approve each registration request" },
            { key: "waitlistEnabled", label: "Enable waitlist", desc: "Allow guests to join a waitlist when full" },
            { key: "groupRegistration", label: "Allow group registration", desc: "Let one person register multiple guests" },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, [opt.key]: !f[opt.key as keyof typeof f] }))}
                className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
                style={{
                  background: form[opt.key as keyof typeof form] ? "var(--accent-primary)" : "var(--bg-muted)",
                  border: "1px solid var(--bg-border)",
                }}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                  animate={{ left: form[opt.key as keyof typeof form] ? "calc(100% - 22px)" : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tickets summary */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Tickets</h3>
          <button className="btn btn-secondary btn-sm">
            <Plus size={14} />
            Add Ticket
          </button>
        </div>
        {event.ticketTypes.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
            No ticket types. Add one to enable registration.
          </p>
        ) : (
          <div className="space-y-2">
            {event.ticketTypes.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-muted)", border: "1px solid var(--bg-border)" }}>
                <GripVertical size={14} style={{ color: "var(--text-muted)" }} className="cursor-grab" />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {t.quantitySold}{t.quantity ? `/${t.quantity}` : ""} sold
                    {t.price > 0 ? ` · ₹${t.price.toLocaleString("en-IN")}` : " · Free"}
                  </p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors" style={{ color: "var(--accent-danger)" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom questions */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Registration Questions</h3>
          <button className="btn btn-secondary btn-sm">
            <Plus size={14} />
            Add Question
          </button>
        </div>
        {event.regQuestions.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
            No custom questions. Add questions to collect more info from registrants.
          </p>
        ) : (
          <div className="space-y-2">
            {event.regQuestions.map((q) => (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-muted)", border: "1px solid var(--bg-border)" }}>
                <GripVertical size={14} style={{ color: "var(--text-muted)" }} className="cursor-grab" />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q.label}</p>
                  <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                    {q.type.toLowerCase()}{q.isRequired ? " · Required" : " · Optional"}
                  </p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors" style={{ color: "var(--accent-danger)" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn btn-primary">
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {savedMsg && (
          <span className="text-sm" style={{ color: "var(--accent-success)" }}>{savedMsg}</span>
        )}
      </div>
    </div>
  );
}
