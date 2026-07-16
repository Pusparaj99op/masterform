import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EventFlow — Create events people actually show up to",
    template: "%s | EventFlow",
  },
  description:
    "Beautiful event pages, smart registration, built-in payments. No platform fees. Ever.",
  keywords: ["event management", "event registration", "tickets", "Stripe payments"],
  authors: [{ name: "EventFlow" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "EventFlow",
    title: "EventFlow — Create events people actually show up to",
    description:
      "Beautiful event pages, smart registration, built-in payments. No platform fees.",
    images: [{ url: `${process.env.NEXT_PUBLIC_URL}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventFlow",
    description: "Create events people actually show up to.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
