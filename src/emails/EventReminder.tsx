import * as React from "react";

type ReminderVariant = "24h" | "1h";

interface Props {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  guestName: string;
  eventSlug: string;
  variant: ReminderVariant;
  onlineLink?: string;
}

export function EventReminder({
  eventTitle,
  eventDate,
  eventLocation,
  guestName,
  eventSlug,
  variant,
  onlineLink,
}: Props) {
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/e/${eventSlug}`;
  const isLastHour = variant === "1h";

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{isLastHour ? "Starting in 1 hour" : "Tomorrow"}: {eventTitle}</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0a0a0f",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: "#e5e5ea",
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#0a0a0f", padding: "40px 16px" }}>
          <tbody>
            <tr>
              <td align="center">
                <table
                  width="560"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    backgroundColor: "#111118",
                    borderRadius: "16px",
                    border: "1px solid #2a2a3a",
                    maxWidth: "560px",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          background: isLastHour
                            ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                            : "linear-gradient(135deg, #3ecf8e 0%, #059669 100%)",
                          padding: "32px 40px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                          {isLastHour ? "🚀" : "🔔"}
                        </div>
                        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#ffffff" }}>
                          {isLastHour ? "Starting in 1 Hour!" : "Happening Tomorrow!"}
                        </h1>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: "32px 40px" }}>
                        <p style={{ margin: "0 0 8px", fontSize: "15px", color: "#a0a0b0" }}>
                          Hi {guestName},
                        </p>
                        <p style={{ margin: "0 0 24px", fontSize: "15px", color: "#e5e5ea" }}>
                          Just a reminder — <strong style={{ color: "#ffffff" }}>{eventTitle}</strong>{" "}
                          {isLastHour ? "starts in less than an hour" : "is happening tomorrow"}.
                          We&apos;re excited to see you there!
                        </p>

                        {/* Event card */}
                        <table
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            backgroundColor: "#1a1a28",
                            borderRadius: "12px",
                            border: "1px solid #2a2a3a",
                            padding: "20px 24px",
                            marginBottom: "24px",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td>
                                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#6b6b8a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                  Event
                                </p>
                                <p style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                                  {eventTitle}
                                </p>
                                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#6b6b8a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                  When
                                </p>
                                <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#e5e5ea" }}>
                                  {eventDate}
                                </p>
                                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#6b6b8a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                  Where
                                </p>
                                <p style={{ margin: 0, fontSize: "14px", color: "#e5e5ea" }}>
                                  {eventLocation}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {onlineLink && (
                          <a
                            href={onlineLink}
                            style={{
                              display: "block",
                              textAlign: "center",
                              padding: "14px 24px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #5b5fef 0%, #7c3aed 100%)",
                              color: "#ffffff",
                              fontSize: "15px",
                              fontWeight: 600,
                              textDecoration: "none",
                              marginBottom: "12px",
                            }}
                          >
                            Join Online →
                          </a>
                        )}

                        <a
                          href={eventUrl}
                          style={{
                            display: "block",
                            textAlign: "center",
                            padding: "14px 24px",
                            borderRadius: "10px",
                            backgroundColor: "#1a1a28",
                            border: "1px solid #2a2a3a",
                            color: "#e5e5ea",
                            fontSize: "15px",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          View Event Details
                        </a>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ padding: "24px 40px", borderTop: "1px solid #2a2a3a", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b6b8a" }}>
                          Reminder sent by EventFlow ·{" "}
                          <a href={eventUrl} style={{ color: "#5b5fef", textDecoration: "none" }}>
                            View event
                          </a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

export default EventReminder;
