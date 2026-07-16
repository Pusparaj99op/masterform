import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/r2";
import { randomBytes } from "crypto";
const nanoid = (n: number) => randomBytes(n).toString("base64url").slice(0, n);

const uploadSchema = z.object({
  filename: z.string(),
  contentType: z.string().regex(/^image\/(jpeg|jpg|png|webp|gif)$/),
  folder: z.enum(["covers", "avatars", "attachments"]).default("covers"),
});

// POST /api/upload — generate R2 presigned PUT URL
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { filename, contentType, folder } = uploadSchema.parse(body);

    const ext = filename.split(".").pop() ?? "jpg";
    const key = `${folder}/${user.id}-${nanoid(12)}.${ext}`;

    const presignedUrl = await getPresignedUploadUrl(key, contentType, 300);
    const publicUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ presignedUrl, key, publicUrl });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
