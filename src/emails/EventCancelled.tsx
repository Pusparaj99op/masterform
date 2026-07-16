import * as React from "react";

interface Props {
  eventTitle: string;
  eventDate: string;
  guestName: string;
  eventSlug: string;
  wasPaid: boolean;
  refundAmount?: number;
  refundDays?: number;
}

export function EventCancelled({
  eventTitle,
  eventDate,
  guestName,
  eventSlug,
  wasPaid,
  refundAmount,
  refundDays = 5,
}: Props) {
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/e/${eventSlug}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Event Cancelled: {eventTitle}</title>
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
                          background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                          padding: "32px 40px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "36px", marginBottom: "12px" }}>😔</div>
                        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#ffffff" }}>
                          Event Cancelled
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
                          We&apos;re sorry to inform you that{" "}
                          <strong style={{ color: "#ffffff" }}>{eventTitle}</strong>{" "}
                          scheduled for <strong style={{ color: "#ffffff" }}>{eventDate}</strong>{" "}
                          has been cancelled.
                        </p>

                        {wasPaid && refundAmount !== undefined && (
                          <table
                            width="100%"
                            cellPadding={0}
                            cellSpacing={0}
                            style={{
                              backgroundColor: "rgba(62, 207, 142, 0.08)",
                              border: "1px solid rgba(62, 207, 142, 0.2)",
                              borderRadius: "12px",
                              padding: "20px 24px",
                              marginBottom: "24px",
                            }}
                          >
                            <tbody>
                              <tr>
                                <td>
                                  <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: "#3ecf8e" }}>
                                    ✓ Refund Initiated
                                  </p>
                                  <p style={{ margin: 0, fontSize: "14px", color: "#e5e5ea" }}>
                                    A refund of{" "}
                                    <strong style={{ color: "#ffffff" }}>
                                      ₹{refundAmount.toLocaleString("en-IN")}
                                    </strong>{" "}
                                    has been initiated to your original payment method.
                                    It may take up to <strong style={{ color: "#ffffff" }}>{refundDays} business days</strong>{" "}
                                    to appear.
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                        {!wasPaid && (
                          <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#a0a0b0" }}>
                            Since your registration was free, no refund is necessary.
                          </p>
                        )}

                        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#a0a0b0" }}>
                          We apologize for any inconvenience. Check out other events on EventFlow to find something
                          you&apos;ll enjoy.
                        </p>

                        <a
                          href={`${process.env.NEXT_PUBLIC_URL}/discover`}
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
                          Discover Other Events →
                        </a>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ padding: "24px 40px", borderTop: "1px solid #2a2a3a", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b6b8a" }}>
                          Questions? Reply to this email or contact us at support@eventflow.app
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

export default EventCancelled;
