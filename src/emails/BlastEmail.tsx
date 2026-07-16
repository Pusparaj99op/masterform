import * as React from "react";

interface Props {
  eventTitle: string;
  eventDate: string;
  organizerName: string;
  organizerAvatarUrl?: string;
  body: string;
  eventSlug: string;
  guestName: string;
}

export function BlastEmail({
  eventTitle,
  eventDate,
  organizerName,
  organizerAvatarUrl,
  body,
  eventSlug,
  guestName,
}: Props) {
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/e/${eventSlug}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Update from {organizerName}: {eventTitle}</title>
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
                    {/* Event header strip */}
                    <tr>
                      <td
                        style={{
                          padding: "16px 24px",
                          backgroundColor: "#1a1a28",
                          borderBottom: "1px solid #2a2a3a",
                        }}
                      >
                        <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#6b6b8a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Update for
                        </p>
                        <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
                          {eventTitle}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b6b8a" }}>
                          {eventDate}
                        </p>
                      </td>
                    </tr>

                    {/* Organizer + body */}
                    <tr>
                      <td style={{ padding: "32px 40px" }}>
                        {/* Organizer avatar */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: "20px" }}>
                          <tbody>
                            <tr>
                              <td style={{ width: "40px", verticalAlign: "top" }}>
                                {organizerAvatarUrl ? (
                                  <img
                                    src={organizerAvatarUrl}
                                    alt={organizerName}
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: "50%", display: "block" }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      backgroundColor: "#5b5fef",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "16px",
                                      fontWeight: 700,
                                      color: "#ffffff",
                                      textAlign: "center",
                                      lineHeight: "40px",
                                    }}
                                  >
                                    {organizerName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </td>
                              <td style={{ paddingLeft: "12px", verticalAlign: "middle" }}>
                                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#ffffff" }}>
                                  {organizerName}
                                </p>
                                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b6b8a" }}>
                                  Organizer
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#a0a0b0" }}>
                          Hi {guestName},
                        </p>

                        {/* Message body — rendered as paragraphs from HTML string */}
                        <div
                          style={{
                            fontSize: "15px",
                            lineHeight: "1.7",
                            color: "#e5e5ea",
                            marginBottom: "28px",
                          }}
                          dangerouslySetInnerHTML={{ __html: body }}
                        />

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
                          View Event →
                        </a>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ padding: "24px 40px", borderTop: "1px solid #2a2a3a", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b6b8a" }}>
                          You received this because you registered for {eventTitle}.{" "}
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

export default BlastEmail;
