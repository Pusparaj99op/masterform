"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Download, UserCheck, Mail, QrCode,
  Eye, EyeOff, ChevronRight, X, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type RegStatus = "GOING" | "WAITLISTED" | "PENDING_APPROVAL" | "DECLINED" | "CANCELLED";

interface Guest {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  status: RegStatus;
  checkInAt: string | null;
  createdAt: string;
  ticketType: { name: string; price: number };
  user: { name: string | null; avatarUrl: string | null; email: string } | null;
}

interface GuestsTabProps {
  eventId: string;
  capacity: number | null;
}

const statusConfig: Record<RegStatus, { label: string; class: string }> = {
  GOING: { label: "Going", class: "badge-success" },
  WAITLISTED: { label: "Waitlisted", class: "badge-warning" },
  PENDING_APPROVAL: { label: "Pending", class: "badge-muted" },
  DECLINED: { label: "Declined", class: "badge-danger" },
  CANCELLED: { label: "Cancelled", class: "badge-danger" },
};

export default function GuestsTab({ eventId, capacity }: GuestsTabProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, [search, statusFilter]);

  async function fetchGuests() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);

    const res = await fetch(`/api/events/${eventId}/guests?${params}`);
    if (res.ok) {
      const data = await res.json();
      setGuests(data.registrations);
      setTotal(data.total);
      setStats(data.stats ?? {});
    }
    setLoading(false);
  }

  const going = stats["GOING"] ?? 0;

  async function handleCheckIn(guestId: string) {
    setCheckingIn(true);
    const res = await fetch(`/api/events/${eventId}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: guestId }),
    });
    if (res.ok) {
      fetchGuests();
      if (selectedGuest?.id === guestId) {
        setSelectedGuest((g) => g ? { ...g, checkInAt: new Date().toISOString() } : null);
      }
    }
    setCheckingIn(false);
  }

  async function exportCSV() {
    const res = await fetch(`/api/events/${eventId}/guests?limit=9999`);
    const data = await res.json();
    const rows = data.registrations.map((g: Guest) => [
      g.user?.name ?? g.guestName,
      g.user?.email ?? g.guestEmail,
      g.ticketType.name,
      g.status,
      g.checkInAt ? "Yes" : "No",
      format(new Date(g.createdAt), "MMM d, yyyy"),
    ]);

    const csv = [
      ["Name", "Email", "Ticket", "Status", "Checked In", "Registered"],
      ...rows,
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests-${eventId}.csv`;
    a.click();
  }

  return (
    <div className="p-6">
      {/* Capacity bar */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--accent-success)" }}>
            <span className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" />
            {going} Going
          </span>
          {capacity && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              cap {capacity}
            </span>
          )}
        </div>
        {capacity && (
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--accent-success)" }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((going / capacity) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Mail, label: "Invite Guests", desc: "Share your event" },
          { icon: QrCode, label: "Check In Guests", desc: "Scan QR codes" },
          { icon: Eye, label: "Guest List", desc: "Shown to guests" },
        ].map((card) => (
          <button
            key={card.label}
            className="card p-3 text-left hover:border-opacity-60 transition-all hover:-translate-y-0.5"
          >
            <card.icon size={18} className="mb-2" style={{ color: "var(--accent-primary)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{card.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Search + filter + export */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 input-base">
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-base w-auto text-sm"
          style={{ width: "auto", minWidth: "130px" }}
        >
          <option value="all">All Guests</option>
          <option value="GOING">Going</option>
          <option value="WAITLISTED">Waitlisted</option>
          <option value="PENDING_APPROVAL">Pending</option>
        </select>
        <button onClick={exportCSV} className="btn btn-secondary btn-sm">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Guest table */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div
          className="grid text-xs font-medium px-4 py-3 border-b"
          style={{
            gridTemplateColumns: "2fr 2fr 1fr 1fr auto",
            color: "var(--text-muted)",
            borderColor: "var(--bg-border)",
          }}
        >
          <span>Name</span>
          <span>Email</span>
          <span>Ticket</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid px-4 py-3.5 border-b" style={{
              gridTemplateColumns: "2fr 2fr 1fr 1fr auto",
              borderColor: "var(--bg-border)",
            }}>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="shimmer h-4 rounded w-3/4" />
              ))}
            </div>
          ))
        ) : guests.length === 0 ? (
          <div className="py-16 text-center">
            <UserCheck size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p style={{ color: "var(--text-secondary)" }}>No guests found</p>
          </div>
        ) : (
          guests.map((guest) => {
            const name = guest.user?.name ?? guest.guestName ?? "—";
            const email = guest.user?.email ?? guest.guestEmail ?? "—";
            const cfg = statusConfig[guest.status];
            return (
              <div
                key={guest.id}
                className="table-row cursor-pointer"
                style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr auto" }}
                onClick={() => setSelectedGuest(guest)}
              >
                <div className="px-4 py-3.5 flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    {name[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{name}</span>
                </div>
                <div className="px-4 py-3.5 flex items-center">
                  <span className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>{email}</span>
                </div>
                <div className="px-4 py-3.5 flex items-center">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{guest.ticketType.name}</span>
                </div>
                <div className="px-4 py-3.5 flex items-center">
                  <span className={`badge ${cfg.class}`}>{cfg.label}</span>
                </div>
                <div className="px-4 py-3.5 flex items-center">
                  <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Guest detail panel */}
      <AnimatePresence>
        {selectedGuest && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuest(null)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-80 border-l overflow-y-auto"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--bg-border)",
              }}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Guest Details</h3>
                  <button onClick={() => setSelectedGuest(null)} className="btn-ghost p-1 rounded-lg">
                    <X size={16} />
                  </button>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    {(selectedGuest.user?.name ?? selectedGuest.guestName ?? "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {selectedGuest.user?.name ?? selectedGuest.guestName ?? "Unknown"}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {selectedGuest.user?.email ?? selectedGuest.guestEmail}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Ticket", value: selectedGuest.ticketType.name },
                    { label: "Status", value: statusConfig[selectedGuest.status].label },
                    { label: "Registered", value: format(new Date(selectedGuest.createdAt), "MMM d, yyyy 'at' h:mm a") },
                    { label: "Checked In", value: selectedGuest.checkInAt ? format(new Date(selectedGuest.checkInAt), "MMM d 'at' h:mm a") : "Not yet" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
                      <span style={{ color: "var(--text-primary)" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Check-in button */}
                {!selectedGuest.checkInAt && selectedGuest.status === "GOING" && (
                  <button
                    onClick={() => handleCheckIn(selectedGuest.id)}
                    disabled={checkingIn}
                    className="btn btn-primary w-full justify-center"
                  >
                    <UserCheck size={16} />
                    {checkingIn ? "Checking in..." : "Mark as Checked In"}
                  </button>
                )}
                {selectedGuest.checkInAt && (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl" style={{ background: "rgba(62,207,142,0.1)", color: "var(--accent-success)" }}>
                    <Check size={16} />
                    <span className="text-sm font-medium">Checked In</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
