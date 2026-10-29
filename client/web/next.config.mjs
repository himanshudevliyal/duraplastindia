import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

// Backend that serves uploaded images (product / blog pictures)
const fileBase = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_FILE_BASE);
  } catch {
    return null;
  }
})();

const remotePatterns = [
  { protocol: "http", hostname: "localhost", port: "3000" },
  { protocol: "http", hostname: "localhost", port: "3001" },
  { protocol: "http", hostname: "localhost", port: "8001" },
  { protocol: "https", hostname: "duraplastapi.bwdemo.in" },
];

if (fileBase) {
  remotePatterns.push({
    protocol: fileBase.protocol.replace(":", ""),
    hostname: fileBase.hostname,
    port: fileBase.port,
  });
}

// Applied to every response. CSP (needs a per-request nonce) is set in proxy.js.
const securityHeaders = [
  // HTTPS only (ignored by browsers on plain http, e.g. localhost)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), usb=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
    // Serve resized AVIF / WebP instead of the original (multi-MB) files
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: 2678400, // 31 days
    // only when the API is on localhost (local development)
    dangerouslyAllowLocalIP: fileBase?.hostname === "localhost",
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // public/img and fonts are not content-hashed: cache, then revalidate
      {
        source: "/:dir(img|font)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  // non-www => www (permanent 308), keeps path and query
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "duraplastindia.com" }],
        destination: "https://www.duraplastindia.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
