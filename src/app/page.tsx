"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Calendar, MapPin, Users, ArrowRight, Zap, CreditCard, BarChart2, Mail, Code2, Star } from "lucide-react";

const heroWords = ["Create", "events", "people", "actually", "show", "up", "to."];

const features = [
  {
    icon: Star,
    title: "Beautiful Event Pages",
    desc: "Stunning covers, rich descriptions, custom URLs. Your event, your brand.",
    color: "var(--accent-primary)",
  },
  {
    icon: CreditCard,
    title: "Real Payments. Zero Platform Fees.",
    desc: "Connect Stripe in 2 minutes. Keep 100% of revenue minus Stripe's fee.",
    color: "var(--accent-gold)",
  },
  {
    icon: Users,
    title: "Smart Guest Management",
    desc: "Search, filter, approve, check in — everything in one place.",
    color: "var(--accent-success)",
  },
  {
    icon: Mail,
    title: "Blast Messages",
    desc: "Send targeted emails to your registered guests instantly.",
    color: "var(--accent-primary)",
  },
  {
    icon: BarChart2,
    title: "Deep Insights",
    desc: "Page views, referrals, conversion funnels, revenue charts.",
    color: "var(--accent-warning)",
  },
  {
    icon: Code2,
    title: "Embed Anywhere",
    desc: "Embed a button or full event page on your existing site.",
    color: "var(--accent-success)",
  },
];

const mockEvents = [
  { title: "Web3 Builders Night", date: "Aug 3 · 7 PM", going: 48, tag: "Free", location: "Mumbai" },
  { title: "Design Systems Workshop", date: "Aug 8 · 2 PM", going: 120, tag: "₹499", location: "Online" },
  { title: "Startup Pitch Night", date: "Aug 12 · 6 PM", going: 200, tag: "₹999", location: "Bengaluru" },
  { title: "AI & Coffee Meetup", date: "Aug 15 · 10 AM", going: 34, tag: "Free", location: "Pune" },
  { title: "Product Hunt Launch Party", date: "Aug 20 · 8 PM", going: 89, tag: "Free", location: "Delhi" },
  { title: "DeFi Protocol Summit", date: "Sep 1 · 9 AM", going: 340, tag: "₹2,999", location: "Goa" },
];

const pricingTiers = [
  {
    name: "Free",
    price: { monthly: 0, annually: 0 },
    desc: "For individuals getting started",
    features: ["Unlimited free events", "Basic registration", "Guest list & check-in", "Stripe payments (Stripe fees apply)"],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Creator",
    price: { monthly: 499, annually: 4999 },
    desc: "For serious event organizers",
    features: ["Everything in Free", "Custom event URLs", "Unlimited ticket types", "Coupon codes", "Email blasts", "Priority support"],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Organization",
    price: { monthly: 1999, annually: 19999 },
    desc: "For teams & enterprises",
    features: ["Everything in Creator", "Team member access", "White-label branding", "API access", "Custom domain", "Dedicated support"],
    cta: "Talk to us",
    highlight: false,
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<"monthly" | "annually">("monthly");

  return (
    <div className="relative overflow-hidden" style={{ background: "var(--bg-base)" }}>

      {/* ─── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: "var(--text-primary)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-primary)" }}>
              <Zap size={14} className="text-white" />
            </div>
            EventFlow
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Link href="/discover" className="hover:text-[var(--text-primary)] transition-colors">Discover</Link>
            <Link href="/pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</Link>
            <Link href="/sign-in" className="hover:text-[var(--text-primary)] transition-colors">Sign in</Link>
            <Link href="/sign-up" className="btn btn-primary btn-sm">Create event →</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-14 noise" ref={heroRef}>
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(91,95,239,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="badge badge-indigo">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] inline-block" />
              No platform fees · Ever
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                className="hero-word inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  color: i === 3 || i === 4 || i === 5 ? "var(--accent-primary)" : "var(--text-primary)",
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Beautiful event pages, smart registration, built-in payments.
            <br />
            <span style={{ color: "var(--text-muted)" }}>No platform fees. Ever.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          >
            <Link href="/sign-up" className="btn btn-primary btn-lg">
              Create your event <ArrowRight size={18} />
            </Link>
            <Link href="/discover" className="btn btn-secondary btn-lg">
              Browse events
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Trusted by 1,000+ creators · No credit card required
          </motion.p>
        </div>

        {/* Floating event cards demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="relative z-10 mt-20 w-full max-w-xs mx-auto"
        >
          {mockEvents.slice(0, 3).map((ev, i) => (
            <div
              key={i}
              className="card absolute w-full p-4 transition-all"
              style={{
                top: `${i * -8}px`,
                left: `${i * 4}px`,
                transform: `rotate(${(i - 1) * 1.5}deg)`,
                zIndex: 3 - i,
                opacity: 1 - i * 0.2,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{ev.title}</span>
                <span className={`badge ${ev.tag === "Free" ? "badge-success" : "badge-gold"}`}>{ev.tag}</span>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1"><Calendar size={11} />{ev.date}</span>
                <span className="flex items-center gap-1"><MapPin size={11} />{ev.location}</span>
                <span className="flex items-center gap-1"><Users size={11} />{ev.going}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-primary)" }}>Features</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Everything you need to run great events
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            From creation to check-in, EventFlow handles the entire lifecycle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="card p-6 hover:-translate-y-1 transition-transform cursor-default"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}
              >
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── MARQUEE (events) ─────────────────────────────────────────────── */}
      <section className="py-8 overflow-hidden border-y" style={{ borderColor: "var(--bg-border)" }}>
        <div className="flex">
          <div className="marquee-track flex gap-4 shrink-0">
            {[...mockEvents, ...mockEvents].map((ev, i) => (
              <div
                key={i}
                className="card flex-shrink-0 w-64 p-4"
              >
                <div
                  className="w-full h-20 rounded-lg mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${["#5B5FEF","#D4A853","#3ECF8E","#EF4444","#F59E0B","#818CF8"][i % 6]}20, ${["#4448D8","#B8902A","#2BA86B","#DC2626","#D97706","#6366F1"][i % 6]}20)`,
                  }}
                />
                <p className="text-sm font-semibold mb-1 truncate" style={{ color: "var(--text-primary)" }}>{ev.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ev.date} · {ev.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 max-w-5xl mx-auto" id="pricing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-primary)" }}>Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Start free. No platform fees on any plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 relative"
              style={tier.highlight ? {
                borderColor: "var(--accent-primary)",
                boxShadow: "var(--shadow-glow-indigo)",
              } : {}}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-indigo text-xs font-semibold">Most Popular</span>
                </div>
              )}
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>{tier.name}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {tier.price.monthly === 0 ? "Free" : `₹${tier.price.monthly.toLocaleString("en-IN")}`}
                </span>
                {tier.price.monthly > 0 && <span className="text-sm" style={{ color: "var(--text-muted)" }}>/mo</span>}
              </div>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{tier.desc}</p>
              <ul className="space-y-2 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-0.5" style={{ color: "var(--accent-success)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`btn w-full justify-center ${tier.highlight ? "btn-primary" : "btn-secondary"}`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA FOOTER ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center" style={{ borderTop: "1px solid var(--bg-border)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
            Ready to create your first event?
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--text-secondary)" }}>
            Join 1,000+ creators using EventFlow.
          </p>
          <Link href="/sign-up" className="btn btn-primary btn-lg inline-flex">
            Get started — it's free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-8 px-6" style={{ borderTop: "1px solid var(--bg-border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "var(--accent-primary)" }}>
              <Zap size={10} className="text-white" />
            </div>
            EventFlow
          </Link>
          <div className="flex items-center gap-6 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/discover">Discover</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/sign-in">Sign in</Link>
            <span>© 2025 EventFlow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
