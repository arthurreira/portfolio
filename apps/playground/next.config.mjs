// Deliberately not a copy of apps/web's policy — this app loads a different
// set of origins. It has no chat Worker, no Turnstile and no analytics, but it
// does pull demo card artwork from picsum. The example.com / github.com /
// dribbble.com / apps.apple.com URLs in data/cards are anchor hrefs, not
// subresources, so they need no directive.
const PICSUM_ORIGIN = "https://picsum.photos"

// Same two caveats as apps/web: next/font self-hosts, so no Google Fonts
// origin; and the inline RSC payload scripts rule out hashing.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${PICSUM_ORIGIN}`,
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@arthurreira/ui"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: csp },
          // Enforcing while frame-ancestors above is still only reporting.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
}

export default nextConfig
