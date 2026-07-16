"use client";
import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Zap, Menu, X, ChevronRight } from "lucide-react";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: "1px solid var(--glass-border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-primary)" }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <span style={{ color: "var(--text-primary)" }}>EventFlow</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/discover", label: "Discover" },
            { href: "/pricing", label: "Pricing" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="btn btn-primary btn-sm"
          >
            Get Started <ChevronRight size={14} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-3"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--bg-border)",
          }}
        >
          <Link href="/discover" className="block text-sm py-2" style={{ color: "var(--text-secondary)" }}>
            Discover
          </Link>
          <Link href="/pricing" className="block text-sm py-2" style={{ color: "var(--text-secondary)" }}>
            Pricing
          </Link>
          <div className="flex gap-2 pt-2">
            <Link href="/sign-in" className="btn btn-secondary btn-sm flex-1 justify-center">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn btn-primary btn-sm flex-1 justify-center">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
