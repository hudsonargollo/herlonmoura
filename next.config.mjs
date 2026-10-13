/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages deployment
  output: "export",
  images: {
    unoptimized: true,
  },
  // Note: API routes are deployed separately as Cloudflare Pages Functions
  // This config is for the static site only
  // Admin routes with dynamic params are handled client-side
};

export default nextConfig;
