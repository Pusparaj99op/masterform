"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", href: "overview" },
  { label: "Guests", href: "guests" },
  { label: "Registration", href: "registration" },
  { label: "Blasts", href: "blasts" },
  { label: "Insights", href: "insights" },
  { label: "More", href: "more" },
];

export default function EventManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = params.eventId as string;

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div
        className="flex items-center gap-1 px-6 border-b flex-shrink-0 overflow-x-auto"
        style={{ borderColor: "var(--bg-border)" }}
      >
        {tabs.map((tab) => {
          const href = `/events/${params.eventId}/${tab.href}`;
          const active = pathname.includes(`/${tab.href}`);
          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                active
                  ? "border-[var(--accent-primary)] text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
