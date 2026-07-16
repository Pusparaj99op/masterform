"use client";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import type { Metadata } from "next";

interface StripeStatus {
  connected: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  onboardingComplete?: boolean;
}

export default function PayoutsPage() {
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetch("/api/stripe/connect")
      .then((r) => r.json())
      .then((d) => {
        setStatus(d);
        setLoading(false);
      });
  }, []);

  async function connectStripe() {
    setConnecting(true);
    const res = await fetch("/api/stripe/connect", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setConnecting(false);
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--text-muted)" }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Payouts</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Connect Stripe to accept payments from attendees. You keep 100% of revenue minus Stripe&apos;s ~2.9% + ₹2.
      </p>

      {/* Stripe Connect status */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: status?.connected ? "rgba(62,207,142,0.15)" : "rgba(91,95,239,0.15)" }}
          >
            {status?.connected ? (
              <CheckCircle size={20} style={{ color: "var(--accent-success)" }} />
            ) : (
              <AlertCircle size={20} style={{ color: "var(--accent-primary)" }} />
            )}
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Stripe Connect
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {status?.connected
                ? status.chargesEnabled
                  ? "Fully active — you can accept payments"
                  : "Connected but onboarding incomplete"
                : "Not connected"}
            </p>
          </div>
          <div className="ml-auto">
            <span
              className="badge"
              style={{
                background: status?.chargesEnabled ? "rgba(62,207,142,0.12)" : "rgba(91,95,239,0.12)",
                color: status?.chargesEnabled ? "var(--accent-success)" : "var(--accent-primary)",
              }}
            >
              {status?.chargesEnabled ? "Active" : status?.connected ? "Pending" : "Not connected"}
            </span>
          </div>
        </div>

        {status?.connected ? (
          <div className="space-y-2">
            {[
              { label: "Charges Enabled", value: status.chargesEnabled },
              { label: "Payouts Enabled", value: status.payoutsEnabled },
              { label: "Onboarding Complete", value: status.onboardingComplete },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                <span style={{ color: row.value ? "var(--accent-success)" : "var(--accent-warning)" }}>
                  {row.value ? "✓ Yes" : "✗ No"}
                </span>
              </div>
            ))}
            {!status.onboardingComplete && (
              <button onClick={connectStripe} disabled={connecting} className="btn btn-primary w-full mt-4 justify-center">
                <ExternalLink size={15} />
                Complete Stripe Onboarding
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Connect your Stripe account to start accepting payments. The setup takes about 2 minutes.
            </p>
            <button onClick={connectStripe} disabled={connecting} className="btn btn-primary w-full justify-center btn-lg">
              {connecting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink size={18} />
                  Connect Stripe Account →
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fee explanation */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>How payments work</h3>
        <ul className="space-y-2">
          {[
            "Attendees pay directly to your Stripe account",
            "EventFlow charges 0% platform fee",
            "Stripe charges ~2.9% + ₹2 per transaction",
            "Payouts are sent to your bank account daily",
            "All refunds are handled through your Stripe dashboard",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="mt-0.5" style={{ color: "var(--accent-success)" }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
