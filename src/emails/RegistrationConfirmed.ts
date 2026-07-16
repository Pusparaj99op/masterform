interface RegistrationConfirmedProps {
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  registrationId: string;
  eventUrl: string;
}

export function RegistrationConfirmedEmail({
  guestName,
  eventTitle,
  eventDate,
  eventLocation,
  registrationId,
  eventUrl,
}: RegistrationConfirmedProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're registered for ${eventTitle}</title>
</head>
<body style="margin:0;padding:0;background:#0C0C0E;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    
    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#5B5FEF;border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:16px;font-weight:bold;">⚡</span>
        </div>
        <span style="color:#F5F5F0;font-weight:700;font-size:18px;">EventFlow</span>
      </div>
    </div>

    <!-- Success banner -->
    <div style="background:rgba(62,207,142,0.1);border:1px solid rgba(62,207,142,0.3);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">🎉</div>
      <p style="margin:0;color:#3ECF8E;font-weight:600;font-size:16px;">You're registered!</p>
    </div>

    <!-- Card -->
    <div style="background:#16161A;border:1px solid #2A2A32;border-radius:16px;padding:28px;margin-bottom:24px;">
      <h1 style="margin:0 0 8px;color:#F5F5F0;font-size:22px;font-weight:700;">
        ${eventTitle}
      </h1>
      <p style="margin:0 0 20px;color:#9898A6;font-size:14px;">
        Hi ${guestName}, your spot is confirmed!
      </p>

      <div style="border-top:1px solid #2A2A32;padding-top:20px;space-y:12px;">
        <div style="margin-bottom:12px;display:flex;gap:8px;">
          <span style="color:#5B5FEF;font-size:14px;">📅</span>
          <span style="color:#B8B8C8;font-size:14px;">${eventDate}</span>
        </div>
        <div style="margin-bottom:20px;display:flex;gap:8px;">
          <span style="color:#5B5FEF;font-size:14px;">📍</span>
          <span style="color:#B8B8C8;font-size:14px;">${eventLocation}</span>
        </div>
        <div style="background:#0C0C0E;border-radius:8px;padding:12px;text-align:center;">
          <p style="margin:0 0 4px;color:#9898A6;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Registration ID</p>
          <p style="margin:0;color:#F5F5F0;font-family:monospace;font-size:14px;font-weight:600;">${registrationId.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${eventUrl}" style="display:inline-block;background:#5B5FEF;color:#fff;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;">
        View Event →
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #2A2A32;padding-top:24px;text-align:center;">
      <p style="margin:0;color:#5C5C70;font-size:12px;">
        You received this because you registered on EventFlow.<br/>
        <a href="${eventUrl}" style="color:#5B5FEF;text-decoration:none;">View event page</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
