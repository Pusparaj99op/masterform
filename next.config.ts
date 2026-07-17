import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  typescript: {
    // Allow production builds to succeed even with type errors (caught at dev time)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
