interface EventReminderProps {
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  onlineUrl?: string;
  registrationId: string;
  eventUrl: string;
  hoursUntil: number;
}

export function EventReminderEmail({
  guestName,
  eventTitle,
  eventDate,
  eventLocation,
  onlineUrl,
  registrationId,
  eventUrl,
  hoursUntil,
}: EventReminderProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reminder: ${eventTitle} is ${hoursUntil <= 1 ? "in 1 hour" : "tomorrow"}!</title>
</head>
<body style="margin:0;padding:0;background:#0C0C0E;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#5B5FEF;border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:16px;font-weight:bold;">⚡</span>
        </div>
        <span style="color:#F5F5F0;font-weight:700;font-size:18px;">EventFlow</span>
      </div>
    </div>

    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#F59E0B;font-weight:600;font-size:14px;">
        ⏰ ${hoursUntil <= 1 ? "Starting in 1 hour" : "Tomorrow"}
      </p>
    </div>

    <div style="background:#16161A;border:1px solid #2A2A32;border-radius:16px;padding:28px;margin-bottom:24px;">
      <h1 style="margin:0 0 6px;color:#F5F5F0;font-size:22px;font-weight:700;">${eventTitle}</h1>
      <p style="margin:0 0 20px;color:#9898A6;font-size:14px;">See you there, ${guestName}!</p>

      <div style="border-top:1px solid #2A2A32;padding-top:20px;">
        <div style="margin-bottom:12px;">
          <span style="color:#9898A6;font-size:12px;display:block;margin-bottom:2px;">DATE &amp; TIME</span>
          <span style="color:#F5F5F0;font-size:14px;font-weight:500;">${eventDate}</span>
        </div>
        <div style="margin-bottom:12px;">
          <span style="color:#9898A6;font-size:12px;display:block;margin-bottom:2px;">LOCATION</span>
          <span style="color:#F5F5F0;font-size:14px;font-weight:500;">${onlineUrl ? "Online Event" : eventLocation}</span>
        </div>
        ${onlineUrl ? `
        <div style="background:rgba(91,95,239,0.08);border:1px solid rgba(91,95,239,0.2);border-radius:8px;padding:12px;margin-top:16px;">
          <p style="margin:0 0 6px;color:#9898A6;font-size:12px;">YOUR JOINING LINK</p>
          <a href="${onlineUrl}" style="color:#5B5FEF;font-size:13px;word-break:break-all;">${onlineUrl}</a>
        </div>` : ""}
      </div>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${eventUrl}" style="display:inline-block;background:#5B5FEF;color:#fff;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;">
        View Event Details →
      </a>
    </div>

    <div style="border-top:1px solid #2A2A32;padding-top:24px;text-align:center;">
      <p style="margin:0;color:#5C5C70;font-size:12px;">
        Reminder for registration <span style="font-family:monospace;">${registrationId.slice(0,8).toUpperCase()}</span>
      </p>
    </div>
  </div>
</body>
</html>`;
}
