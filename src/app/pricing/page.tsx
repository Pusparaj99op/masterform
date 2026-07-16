import Link from "next/link";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { Check, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | EventFlow — 0% Platform Fees",
  description:
    "EventFlow is free for organizers. Keep 100% of your ticket revenue minus only Stripe's processing fee.",
};

const FREE_FEATURES = [
  "Unlimited free events",
  "Unlimited registrations",
  "Guest list & check-in",
  "Email blasts to attendees",
  "Analytics & insights",
  "Custom registration questions",
  "Referral tracking",
  "Calendar integrations",
  "QR code tickets",
  "Embed on your website",
];

const PAID_EXTRAS = [
  "Paid ticketing (Stripe Connect)",
  "0% EventFlow platform fee",
  "Stripe fee: ~2.9% + ₹2 per transaction",
  "UPI, Cards, Net Banking",
  "Instant payouts to your bank",
  "Coupon codes & discounts",
  "Waitlist management",
  "Approval-required events",
];

export default function PricingPage() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <MarketingNav />

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-28 pb-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{
              background: "rgba(91,95,239,0.12)",
              border: "1px solid rgba(91,95,239,0.3)",
              color: "var(--accent-primary)",
            }}
          >
            <Zap size={14} />
            Simple, transparent pricing
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Free forever.{" "}
            <span style={{ color: "var(--accent-primary)" }}>0% fees.</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            EventFlow is completely free. When you sell tickets, you keep 100% of revenue — we only
            pass through Stripe&apos;s standard processing fee.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Free plan */}
          <div className="card p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                For Organizers
              </p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
                  ₹0
                </span>
                <span className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  / month
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                Everything you need to run events professionally.
              </p>
            </div>

            <Link href="/sign-up" className="btn btn-primary w-full justify-center mb-8">
              Get Started Free
            </Link>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(62,207,142,0.15)", color: "var(--accent-success)" }}
                  >
                    <Check size={12} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Paid ticketing */}
          <div
            className="card p-8"
            style={{
              background: "linear-gradient(135deg, rgba(91,95,239,0.08) 0%, rgba(91,95,239,0.02) 100%)",
              borderColor: "rgba(91,95,239,0.3)",
            }}
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--accent-primary)" }}>
                Paid Ticketing
              </p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
                  0%
                </span>
                <span className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  platform fee
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                We charge nothing. Stripe charges ~2.9% + ₹2 per transaction.
              </p>
            </div>

            <Link href="/sign-up" className="btn btn-primary w-full justify-center mb-8">
              Connect Stripe & Sell
            </Link>

            <ul className="space-y-3">
              {PAID_EXTRAS.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(91,95,239,0.12)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    <Check size={12} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comparison table */}
        <div className="card overflow-hidden mb-16">
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "var(--bg-border)", background: "var(--bg-elevated)" }}
          >
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              Fee comparison for a ₹1,000 ticket
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--bg-border)" }}>
            {[
              { platform: "EventFlow", fee: "₹0", stripe: "₹31", total: "₹31", you: "₹969" },
              { platform: "Luma", fee: "₹0", stripe: "₹31", total: "₹31", you: "₹969" },
              { platform: "Eventbrite", fee: "₹69 (6.9%)", stripe: "₹31", total: "₹100", you: "₹900" },
              { platform: "Townscript", fee: "₹30 (3%)", stripe: "₹31", total: "₹61", you: "₹939" },
            ].map((row) => (
              <div
                key={row.platform}
                className="grid text-sm px-6 py-4"
                style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr" }}
              >
                <span
                  className="font-medium"
                  style={{ color: row.platform === "EventFlow" ? "var(--accent-primary)" : "var(--text-primary)" }}
                >
                  {row.platform}
                </span>
                <span style={{ color: row.fee === "₹0" ? "var(--accent-success)" : "var(--accent-danger)" }}>
                  {row.fee}
                </span>
                <span style={{ color: "var(--text-secondary)" }}>{row.stripe}</span>
                <span style={{ color: "var(--text-secondary)" }}>{row.total}</span>
                <span
                  className="font-semibold"
                  style={{ color: row.platform === "EventFlow" ? "var(--accent-gold)" : "var(--text-secondary)" }}
                >
                  {row.you}
                </span>
              </div>
            ))}
          </div>
          <div
            className="grid text-xs px-6 py-3 border-t"
            style={{
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
              borderColor: "var(--bg-border)",
              background: "var(--bg-muted)",
              color: "var(--text-muted)",
            }}
          >
            <span>Platform</span>
            <span>Platform fee</span>
            <span>Stripe fee</span>
            <span>Total fee</span>
            <span>You keep</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is EventFlow really free?",
                a: "Yes — creating and managing events is 100% free, forever. We don't charge organizers anything.",
              },
              {
                q: "How do I get paid?",
                a: "Connect your Stripe account (takes 2 mins). Payments go directly to your Stripe, with daily payouts to your bank.",
              },
              {
                q: "What currencies are supported?",
                a: "EventFlow supports INR, USD, EUR, GBP, and all currencies Stripe supports in your region.",
              },
              {
                q: "Can I offer discount codes?",
                a: "Yes — you can create percentage or fixed-amount coupons for any event with paid tickets.",
              },
              {
                q: "How do refunds work?",
                a: "Refunds are issued directly through your Stripe dashboard. EventFlow doesn't handle refund funds.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="card p-5">
                <p className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>
                  {q}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
