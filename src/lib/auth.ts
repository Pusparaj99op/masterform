import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/**
 * Get the current authenticated user from Clerk + Prisma.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { stripeAccount: true },
  });

  return user;
}

/**
 * Get current user or throw (for protected API routes).
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Sync a Clerk user to the Prisma database.
 * Called from Clerk webhook on user.created / user.updated.
 */
export async function syncClerkUser(clerkUserId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const user = await db.user.upsert({
    where: { clerkId: clerkUserId },
    create: {
      clerkId: clerkUserId,
      email,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
      avatarUrl: clerkUser.imageUrl ?? null,
    },
    update: {
      email,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
      avatarUrl: clerkUser.imageUrl ?? null,
    },
  });

  return user;
}
