import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatEventDateRange } from "@/lib/utils";
import { Calendar, MapPin, Globe, Users, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import EventPublicClient from "./EventPublicClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await db.event.findUnique({
    where: { slug },
    select: { title: true, description: true, coverImageUrl: true, metaTitle: true, metaDescription: true },
  });

  if (!event) return { title: "Event Not Found" };

  return {
    title: event.metaTitle ?? event.title,
    description: event.metaDescription ?? (event.description ? event.description.slice(0, 160) : undefined),
    openGraph: {
      title: event.title,
      images: event.coverImageUrl ? [{ url: event.coverImageUrl }] : [],
    },
  };
}

export default async function PublicEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;

  const event = await db.event.findUnique({
    where: { slug, visibility: "PUBLIC" },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          twitterHandle: true,
          websiteUrl: true,
          bio: true,
        },
      },
      cohosts: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
      ticketTypes: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
      registrations: {
        where: { status: "GOING" },
        select: { id: true, guestName: true, user: { select: { avatarUrl: true, name: true } } },
        take: 12,
        orderBy: { createdAt: "desc" },
      },
      blasts: {
        orderBy: { sentAt: "desc" },
        take: 5,
      },
      _count: {
        select: { registrations: { where: { status: "GOING" } } },
      },
    },
  });

  if (!event) notFound();

  // Track pageview
  // (fire and forget in client component to get UTM params from URL)

  const dateString = formatEventDateRange(event.startsAt, event.endsAt ?? null, event.timezone);
  const isFree = event.ticketTypes.every((t) => t.price === 0);
  const minPrice = isFree
    ? 0
    : Math.min(...event.ticketTypes.filter((t) => t.price > 0).map((t) => t.price));

  const serializable = {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    coverImageUrl: event.coverImageUrl,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt?.toISOString() ?? null,
    timezone: event.timezone,
    locationType: event.locationType,
    locationName: event.locationName,
    locationAddress: event.locationAddress,
    locationLat: event.locationLat,
    locationLng: event.locationLng,
    onlineUrl: null, // Only revealed post-registration
    registrationStatus: event.registrationStatus,
    capacity: event.capacity,
    waitlistEnabled: event.waitlistEnabled,
    host: event.host,
    cohosts: event.cohosts,
    ticketTypes: event.ticketTypes,
    registrations: event.registrations,
    blasts: event.blasts,
    goingCount: event._count.registrations,
    dateString,
    isFree,
    minPrice,
  };

  return <EventPublicClient event={serializable} referralCode={ref} />;
}
