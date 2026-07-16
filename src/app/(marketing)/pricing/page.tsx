import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | EventFlow",
  description:
    "EventFlow is free forever for organizers. No platform fee, no subscription. We only make money when you do.",
};

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for getting started with event management.",
    cta: "Get Started Free",
    href: "/sign-up",
    highlighted: false,
    features: [
      "Unlimited free events",
      "Up to 100 attendees per event",
      "Basic registration forms",
      "Email confirmations",
      "QR code check-in",
      "Public event page",
      "Discover listing",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 999, annual: 799 },
    description: "For serious event organizers who need advanced features.",
    cta: "Start 14-Day Free Trial",
    href: "/sign-up?plan=pro",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "Unlimited attendees",
      "Paid tickets via Stripe Connect",
      "Custom registration questions",
      "Email blasts to attendees",
      "Advanced analytics & insights",
      "Custom event URL slug",
      "Embed widget for your website",
      "Coupon codes",
      "CSV guest export",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: null, annual: null },
    description: "For large organizations, conferences, and recurring events.",
    cta: "Contact Sales",
    href: "mailto:sales@eventflow.app",
    highlighted: false,
    features: [
      "Everything in Pro",
      "White-label branding",
      "Custom domain",
      "SSO / SAML",
      "Dedicated account manager",
      "SLA guarantee",
      "API access",
      "Custom integrations",
      "Bulk event creation",
      "Multi-organizer teams",
    ],
  },
];

const faqs = [
  {
    q: "Do you charge a platform fee on ticket sales?",
    a: "No. EventFlow charges 0% platform fee. Stripe's standard processing fees apply (~2.9% + ₹2 per transaction). You keep the rest.",
  },
  {
    q: "Can I use EventFlow for free events?",
    a: "Absolutely. Free events are always free, forever. No credit card required.",
  },
  {
    q: "What happens when I upgrade to Pro?",
    a: "You get access to paid ticketing, advanced analytics, email blasts, and more. You can upgrade or downgrade at any time.",
  },
  {
    q: "Is there a limit on free events?",
    a: "On the Free plan, you can create unlimited events with up to 100 attendees each. On Pro, there are no limits.",
  },
  {
    q: "How does Stripe Connect work?",
    a: "Connect your Stripe account in Settings → Payouts. Attendees pay directly into your Stripe account. Payouts are deposited to your bank account daily.",
  },
];

export default function PricingPage() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <MarketingNav />

      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-24">
        {/* Hero */}
        <div className="text-center mb-16">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(91,95,239,0.12)",
              color: "var(--accent-primary)",
              border: "1px solid rgba(91,95,239,0.25)",
            }}
          >
            <Zap size={12} />
            Simple, transparent pricing
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Start free.{" "}
            <span style={{ color: "var(--accent-primary)" }}>Scale without limits.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            EventFlow charges 0% platform fees. Pay only for Stripe processing when you collect payments.
            No hidden charges, no surprises.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="card p-6 flex flex-col relative"
              style={
                plan.highlighted
                  ? {
                      border: "1px solid var(--accent-primary)",
                      background: "linear-gradient(180deg, rgba(91,95,239,0.06) 0%, var(--bg-surface) 100%)",
                    }
                  : {}
              }
            >
              {plan.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "var(--accent-primary)",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                {plan.name}
              </p>

              {/* Price */}
              <div className="mb-3">
                {plan.price.monthly === null ? (
                  <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Custom
                  </p>
                ) : plan.price.monthly === 0 ? (
                  <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Free
                  </p>
                ) : (
                  <div>
                    <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                      ₹{plan.price.monthly.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm ml-1" style={{ color: "var(--text-muted)" }}>
                      /month
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={14}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "var(--accent-success)" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className="btn w-full justify-center"
                style={
                  plan.highlighted
                    ? { background: "var(--accent-primary)", color: "#fff" }
                    : {
                        background: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--bg-border)",
                      }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Zero fee callout */}
        <div
          className="rounded-2xl p-8 mb-20 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(62,207,142,0.08) 0%, rgba(91,95,239,0.08) 100%)",
            border: "1px solid rgba(62,207,142,0.2)",
          }}
        >
          <p className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            0% Platform Fee on All Plans
          </p>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Unlike other platforms that take 3–8% of your revenue, EventFlow passes through 100% of ticket
            revenue to you. You only pay Stripe&apos;s standard processing fee.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="card p-5"
              >
                <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {q}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            No credit card required · Cancel anytime
          </p>
          <Link
            href="/sign-up"
            className="btn btn-primary btn-lg"
            style={{ display: "inline-flex" }}
          >
            Start for Free →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
