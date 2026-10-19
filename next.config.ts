import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // NOTE: `rewrites()` does nothing under `output: "export"` — a static export
  // has no server to rewrite from. The previous rewrite here
  // (`/api/crm/:path*` -> `https://herlonmoura-crm.workers.dev/api/:path*`)
  // never executed, and that host no longer resolves. `/api/crm/*` is served by
  // `functions/api/crm/**` Pages Functions, which are compiled into the same
  // deployment, so no rewrite is needed. `headers()` is likewise inert in a
  // static export; set security headers in the Cloudflare dashboard or a
  // `_headers` file instead.
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;