import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a random slug (e.g. for events) */
export function generateSlug(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

/** Truncate text to maxLength with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/** Format a date range string e.g. "Sunday, Aug 3 · 2:00–5:00 PM IST" */
export function formatEventDateRange(
  startsAt: Date,
  endsAt: Date | null,
  timezone: string
): string {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    weekday: "long",
    month: "short",
    day: "numeric",
  };
  const dateStr = new Intl.DateTimeFormat("en-IN", opts).format(startsAt);

  const timeOpts: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const startTime = new Intl.DateTimeFormat("en-IN", timeOpts).format(startsAt);
  if (!endsAt) return `${dateStr} · ${startTime}`;
  const endTime = new Intl.DateTimeFormat("en-IN", timeOpts).format(endsAt);
  return `${dateStr} · ${startTime} – ${endTime}`;
}

/** Generate an ICS calendar file content string */
export function generateICS(event: {
  title: string;
  description?: string | null;
  startsAt: Date;
  endsAt?: Date | null;
  locationAddress?: string | null;
  slug: string;
}): string {
  const dtStart = event.startsAt
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";
  const dtEnd = event.endsAt
    ? event.endsAt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    : dtStart;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EventFlow//EventFlow//EN",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : "",
    event.locationAddress ? `LOCATION:${event.locationAddress}` : "",
    `URL:${process.env.NEXT_PUBLIC_URL}/e/${event.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/** Build a Google Calendar add event URL */
export function googleCalendarUrl(event: {
  title: string;
  startsAt: Date;
  endsAt?: Date | null;
  locationAddress?: string | null;
  description?: string | null;
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.startsAt)}/${fmt(event.endsAt ?? event.startsAt)}`,
    details: event.description ?? "",
    location: event.locationAddress ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Relative time e.g. "2 days ago", "in 3 hours" */
export function relativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = date.getTime() - Date.now();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, "second");
  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  return rtf.format(diffDays, "day");
}
