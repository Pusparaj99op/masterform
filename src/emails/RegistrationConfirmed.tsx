import * as React from "react";

interface Props {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  guestName: string;
  qrCodeUrl: string;
  eventSlug: string;
  registrationId: string;
  addToGoogleUrl?: string;
  addToICalUrl?: string;
}

export function RegistrationConfirmed({
  eventTitle,
  eventDate,
  eventLocation,
  guestName,
  qrCodeUrl,
  eventSlug,
  registrationId,
  addToGoogleUrl,
  addToICalUrl,
}: Props) {
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/e/${eventSlug}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>You&apos;re registered for {eventTitle}</title>
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
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: "#0a0a0f", padding: "40px 16px" }}
        >
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
                    overflow: "hidden",
                    maxWidth: "560px",
                    width: "100%",
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          background: "linear-gradient(135deg, #5b5fef 0%, #7c3aed 100%)",
                          padding: "32px 40px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: "rgba(255,255,255,0.15)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "16px",
                            fontSize: "24px",
                          }}
                        >
                          ⚡
                        </div>
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          EventFlow
                        </p>
                        <h1
                          style={{
                            margin: 0,
                            fontSize: "26px",
                            fontWeight: 700,
                            color: "#ffffff",
                            lineHeight: "1.2",
                          }}
                        >
                          You&apos;re In! 🎉
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
                          Your registration for <strong style={{ color: "#ffffff" }}>{eventTitle}</strong> is confirmed.
                        </p>

                        {/* Event details */}
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
                                  Date & Time
                                </p>
                                <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#e5e5ea" }}>
                                  {eventDate}
                                </p>
                                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#6b6b8a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                  Location
                                </p>
                                <p style={{ margin: 0, fontSize: "14px", color: "#e5e5ea" }}>
                                  {eventLocation}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* QR Code */}
                        <div style={{ textAlign: "center", marginBottom: "24px" }}>
                          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#a0a0b0" }}>
                            Your entry QR code — show this at the door
                          </p>
                          <img
                            src={qrCodeUrl}
                            alt="Entry QR Code"
                            width={160}
                            height={160}
                            style={{
                              borderRadius: "12px",
                              border: "1px solid #2a2a3a",
                              backgroundColor: "#ffffff",
                              padding: "8px",
                            }}
                          />
                          <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#6b6b8a" }}>
                            ID: {registrationId.slice(0, 8).toUpperCase()}
                          </p>
                        </div>

                        {/* Add to Calendar */}
                        {(addToGoogleUrl || addToICalUrl) && (
                          <div style={{ marginBottom: "24px" }}>
                            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#a0a0b0", textAlign: "center" }}>
                              Add to your calendar
                            </p>
                            <table width="100%" cellPadding={0} cellSpacing={0}>
                              <tbody>
                                <tr>
                                  {addToGoogleUrl && (
                                    <td style={{ paddingRight: "8px" }}>
                                      <a
                                        href={addToGoogleUrl}
                                        style={{
                                          display: "block",
                                          textAlign: "center",
                                          padding: "10px",
                                          borderRadius: "8px",
                                          backgroundColor: "#1a1a28",
                                          border: "1px solid #2a2a3a",
                                          color: "#e5e5ea",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          textDecoration: "none",
                                        }}
                                      >
                                        📅 Google Calendar
                                      </a>
                                    </td>
                                  )}
                                  {addToICalUrl && (
                                    <td style={{ paddingLeft: addToGoogleUrl ? "8px" : "0" }}>
                                      <a
                                        href={addToICalUrl}
                                        style={{
                                          display: "block",
                                          textAlign: "center",
                                          padding: "10px",
                                          borderRadius: "8px",
                                          backgroundColor: "#1a1a28",
                                          border: "1px solid #2a2a3a",
                                          color: "#e5e5ea",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          textDecoration: "none",
                                        }}
                                      >
                                        🗓 iCal / Apple
                                      </a>
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* View event CTA */}
                        <a
                          href={eventUrl}
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
                          }}
                        >
                          View Event Page →
                        </a>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: "24px 40px",
                          borderTop: "1px solid #2a2a3a",
                          textAlign: "center",
                        }}
                      >
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b6b8a" }}>
                          You received this because you registered for an event on EventFlow.
                          <br />
                          <a href={eventUrl} style={{ color: "#5b5fef", textDecoration: "none" }}>
                            Manage registration
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

export default RegistrationConfirmed;
