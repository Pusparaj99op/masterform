"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  CreditCard,
  Settings,
  Zap,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/events", icon: CalendarDays, label: "Events" },
  { href: "/calendars", icon: Calendar, label: "Calendars" },
  { href: "/payouts", icon: CreditCard, label: "Payouts" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen" style={{ background: "var(--bg-base)" }}>
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside
        className="relative flex flex-col border-r transition-all duration-300"
        style={{
          width: collapsed ? "60px" : "220px",
          borderColor: "var(--bg-border)",
          background: "var(--bg-base)",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-4 h-14 border-b"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent-primary)" }}
            >
              <Zap size={14} className="text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                EventFlow
              </span>
            )}
          </Link>
        </div>

        {/* Create Event */}
        <div className="px-3 py-3">
          <Link
            href="/events/new"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]"
            )}
          >
            <Plus size={15} className="flex-shrink-0" />
            {!collapsed && <span>New Event</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-t"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-7 h-7",
                userButtonPopoverCard: "bg-[var(--bg-surface)] border border-[var(--bg-border)]",
              },
            }}
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                My Account
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center border transition-colors"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--bg-border)",
            color: "var(--text-muted)",
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="h-14 flex items-center px-6 border-b flex-shrink-0"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <div
            className="flex items-center gap-2 flex-1 max-w-sm rounded-lg px-3 py-2"
            style={{
              background: "var(--bg-muted)",
              border: "1px solid var(--bg-border)",
            }}
          >
            <Search size={14} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 bg-transparent text-sm border-none outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
