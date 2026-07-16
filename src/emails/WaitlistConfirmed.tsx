import * as React from "react";

interface Props {
  eventTitle: string;
  eventDate: string;
  guestName: string;
  eventSlug: string;
}

export function WaitlistConfirmed({ eventTitle, eventDate, guestName, eventSlug }: Props) {
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/e/${eventSlug}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>You&apos;re on the waitlist for {eventTitle}</title>
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
                          background: "linear-gradient(135deg, #d4a853 0%, #f59e0b 100%)",
                          padding: "32px 40px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
                        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#ffffff" }}>
                          You&apos;re on the Waitlist
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
                          You&apos;ve been added to the waitlist for{" "}
                          <strong style={{ color: "#ffffff" }}>{eventTitle}</strong>.
                          We&apos;ll notify you immediately if a spot becomes available.
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
                            marginBottom: "28px",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td>
                                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#6b6b8a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                  Event
                                </p>
                                <p style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                                  {eventTitle}
                                </p>
                                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#6b6b8a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                  Date
                                </p>
                                <p style={{ margin: 0, fontSize: "14px", color: "#e5e5ea" }}>
                                  {eventDate}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#a0a0b0" }}>
                          We&apos;ll send you a confirmation email with your ticket as soon as a spot opens up.
                          No action needed on your end.
                        </p>

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
                          View Event Page
                        </a>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ padding: "24px 40px", borderTop: "1px solid #2a2a3a", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b6b8a" }}>
                          Sent by EventFlow · You can manage your registration at{" "}
                          <a href={eventUrl} style={{ color: "#5b5fef", textDecoration: "none" }}>
                            the event page
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

export default WaitlistConfirmed;
