import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = { title: "Settings | EventFlow" };

export default async function SettingsPage() {
  const user = await requireUser();

  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      twitterHandle: true,
      websiteUrl: true,
    },
  });

  return <SettingsClient initialProfile={profile!} userId={user.id} />;
}
