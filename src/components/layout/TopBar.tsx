"use client";
import { Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface TopBarProps {
  /** Optional page title / breadcrumb shown next to logo area */
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header
      className="h-14 flex items-center gap-4 px-6 border-b flex-shrink-0"
      style={{ borderColor: "var(--bg-border)", background: "var(--bg-base)" }}
    >
      {/* Search */}
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
          placeholder={title ? `Search in ${title}...` : "Search events..."}
          className="flex-1 bg-transparent text-sm border-none outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell placeholder */}
        <button
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-elevated)]"
          style={{ color: "var(--text-muted)" }}
        >
          <Bell size={16} />
        </button>

        {/* User button */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
            },
          }}
        />
      </div>
    </header>
  );
}

export default TopBar;
