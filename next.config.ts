import type { NextConfig } from "next";

/**
 * Optional remote image host (e.g. a Supabase Storage project) so admin-uploaded
 * images can be served through next/image. Set NEXT_PUBLIC_SUPABASE_URL to enable.
 */
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const { hostname } = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  remotePatterns.push({ protocol: "https", hostname, pathname: "/storage/v1/object/public/**" });
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2400],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
