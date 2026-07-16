"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Minus, Plus, Tag } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number | null;
  quantitySold: number;
  description: string | null;
  minPerOrder: number;
  maxPerOrder: number;
}

interface RegQuestion {
  id: string;
  label: string;
  type: string;
  options: string[];
  isRequired: boolean;
}

interface RegisterPageClientProps {
  event: {
    id: string;
    slug: string;
    title: string;
    startsAt: string;
    dateString: string;
    ticketTypes: TicketType[];
    regQuestions: RegQuestion[];
    requireApproval: boolean;
  };
}

export default function RegisterPageClient({ event }: RegisterPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalTickets = Object.values(selections).reduce((a, b) => a + b, 0);
  const subtotal = event.ticketTypes.reduce(
    (sum, t) => sum + (t.price * (selections[t.id] ?? 0)),
    0
  );
  const isFree = subtotal === 0;
  const total = Math.max(0, subtotal - discount);
  const referredBy = searchParams.get("ref") ?? undefined;

  function adjust(ticketId: string, delta: number) {
    const ticket = event.ticketTypes.find((t) => t.id === ticketId)!;
    const current = selections[ticketId] ?? 0;
    const available = ticket.quantity !== null ? ticket.quantity - ticket.quantitySold : 999;
    const next = Math.max(0, Math.min(current + delta, Math.min(available, ticket.maxPerOrder)));
    setSelections((s) => ({ ...s, [ticketId]: next }));
  }

  async function applyCoupon() {
    // TODO: validate coupon via API
    if (couponCode.toLowerCase() === "welcome20") {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    const ticketSelections = Object.entries(selections)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ticketSelections,
          guestInfo,
          couponCode: couponApplied ? couponCode : undefined,
          referredBy,
          utmSource: searchParams.get("utm_source") ?? undefined,
          utmMedium: searchParams.get("utm_medium") ?? undefined,
          utmCampaign: searchParams.get("utm_campaign") ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSubmitting(false);
        return;
      }

      if (data.free) {
        router.push(data.successUrl);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 glass px-4 py-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--glass-border)" }}
      >
        <button onClick={() => step === 1 ? router.back() : setStep(s => s - 1)} className="p-2 rounded-lg" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{event.title}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{event.dateString}</p>
        </div>
        {/* Progress */}
        <div className="flex gap-1">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="w-8 h-1 rounded-full transition-colors"
              style={{ background: s <= step ? "var(--accent-primary)" : "var(--bg-border)" }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Step 1: Ticket selection */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              Select Tickets
            </h2>

            <div className="space-y-3 mb-8">
              {event.ticketTypes.map((ticket) => {
                const soldOut = ticket.quantity !== null && ticket.quantitySold >= ticket.quantity;
                const qty = selections[ticket.id] ?? 0;

                return (
                  <div
                    key={ticket.id}
                    className="card p-4"
                    style={soldOut ? { opacity: 0.5 } : {}}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{ticket.name}</p>
                        {ticket.description && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{ticket.description}</p>
                        )}
                        <p
                          className="text-sm font-semibold mt-1"
                          style={{ color: ticket.price > 0 ? "var(--accent-gold)" : "var(--accent-success)" }}
                        >
                          {ticket.price > 0 ? `₹${ticket.price.toLocaleString("en-IN")}` : "Free"}
                        </p>
                        {soldOut && <span className="badge badge-danger text-xs mt-1">Sold Out</span>}
                      </div>

                      {!soldOut && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjust(ticket.id, -1)}
                            disabled={qty === 0}
                            className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors disabled:opacity-30"
                            style={{ borderColor: "var(--bg-border)", color: "var(--text-primary)" }}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className="w-6 text-center text-sm font-medium tabular-nums"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {qty}
                          </span>
                          <button
                            onClick={() => adjust(ticket.id, 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
                            style={{ borderColor: "var(--bg-border)", color: "var(--text-primary)" }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={totalTickets === 0}
              className="btn btn-primary w-full justify-center btn-lg"
            >
              Continue <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Guest info */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              Your Details
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input-base"
                  placeholder="Your name"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo((g) => ({ ...g, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Email *
                </label>
                <input
                  type="email"
                  className="input-base"
                  placeholder="you@example.com"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo((g) => ({ ...g, email: e.target.value }))}
                />
              </div>

              {/* Custom questions */}
              {event.regQuestions.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    {q.label}{q.isRequired && " *"}
                  </label>
                  {q.type === "SELECT" ? (
                    <select
                      className="input-base"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    >
                      <option value="">Select...</option>
                      {q.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : q.type === "TEXTAREA" ? (
                    <textarea
                      className="input-base"
                      rows={3}
                      placeholder={`Enter ${q.label.toLowerCase()}...`}
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type={q.type === "DATE" ? "date" : q.type === "PHONE" ? "tel" : "text"}
                      className="input-base"
                      placeholder={`Enter ${q.label.toLowerCase()}...`}
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Coupon */}
            {!isFree && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center flex-1 input-base" style={{ padding: 0, paddingLeft: 12 }}>
                    <Tag size={14} className="mr-2 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none outline-none text-sm py-2.5 pr-3 uppercase"
                      placeholder="PROMO"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <button onClick={applyCoupon} className="btn btn-secondary btn-sm px-4">
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs mt-1.5" style={{ color: "var(--accent-success)" }}>
                    ✓ Coupon applied — ₹{discount.toLocaleString("en-IN")} off
                  </p>
                )}
              </div>
            )}

            {/* Order summary */}
            <div className="card p-4 mb-6">
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Order Summary</h3>
              {event.ticketTypes
                .filter((t) => (selections[t.id] ?? 0) > 0)
                .map((t) => (
                  <div key={t.id} className="flex justify-between text-sm mb-1">
                    <span style={{ color: "var(--text-secondary)" }}>
                      {t.name} × {selections[t.id]}
                    </span>
                    <span style={{ color: "var(--text-primary)" }}>
                      {t.price === 0 ? "Free" : `₹${(t.price * selections[t.id]!).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                ))}
              {discount > 0 && (
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "var(--accent-success)" }}>Coupon discount</span>
                  <span style={{ color: "var(--accent-success)" }}>−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div
                className="flex justify-between font-semibold text-sm pt-2 mt-2 border-t"
                style={{ borderColor: "var(--bg-border)", color: "var(--text-primary)" }}
              >
                <span>Total</span>
                <span>{isFree ? "Free" : `₹${total.toLocaleString("en-IN")}`}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm mb-4 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", color: "var(--accent-danger)" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!guestInfo.name || !guestInfo.email || submitting}
              className="btn btn-primary w-full justify-center btn-lg"
            >
              {submitting ? "Processing..." : isFree ? "Complete Registration" : `Pay ₹${total.toLocaleString("en-IN")}`}
            </button>

            <p className="text-xs text-center mt-3" style={{ color: "var(--text-muted)" }}>
              🔒 Secured by Stripe
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
