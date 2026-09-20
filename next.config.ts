import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ["192.168.11.20", "192.168.11.20:3000", "localhost:3000"],
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      // Embeds from YouTube remain available; the fan site itself cannot be framed.
      { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'" },
    ];
    const previewHeaders = process.env.KYOUPOKE_DEPLOY_TARGET === "cloudflare-preview"
      ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      : [];

    // Keep / explicit: the vinext preview does not apply /:path* to its root route.
    return ["/", "/:path*"].map((source) => ({
      source,
      headers: [...securityHeaders, ...previewHeaders],
    }));
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [384, 640, 960, 1280, 1600],
    imageSizes: [48, 96, 192, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
} satisfies NextConfig;

export default nextConfig;
