import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const profileSchema = z.object({
  name: z.string().max(100).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  twitterHandle: z.string().max(50).optional().nullable(),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
});

// GET /api/user/profile
export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// PATCH /api/user/profile
export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = profileSchema.parse(body);

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name ?? undefined,
        bio: data.bio ?? undefined,
        twitterHandle: data.twitterHandle ?? undefined,
        websiteUrl: data.websiteUrl || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        twitterHandle: true,
        websiteUrl: true,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
