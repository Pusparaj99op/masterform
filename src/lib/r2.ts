import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

/**
 * Generate a presigned PUT URL for direct browser → R2 uploads.
 * @param key  e.g. "covers/event-abc123.jpg"
 * @param contentType  e.g. "image/jpeg"
 * @param expiresIn  seconds, default 300
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(R2, command, { expiresIn });
}

/**
 * Delete an object from R2 by key.
 */
export async function deleteR2Object(key: string): Promise<void> {
  await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Get public URL for an R2 object (via R2 public bucket / Workers).
 */
export function getPublicUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL!;
  return `${base}/${key}`;
}

export { R2 };
