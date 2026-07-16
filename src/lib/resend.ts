import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL ?? "EventFlow <events@eventflow.app>";
  const result = await resend.emails.send({ from, to, subject, html });
  return result;
}
