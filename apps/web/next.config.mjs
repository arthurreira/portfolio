/* global process */
// The shared eslint config declares serviceworker globals, not node ones, so
// `process` reads as undefined here without this.
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

// Derived so the policy follows the Worker URL instead of drifting from it.
// Declared in turbo.json's build `env`, without which a changed URL would hit
// the cache and ship a bundle whose CSP names the old origin.
const CHAT_API_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_CHAT_API_URL ??
    "https://chat-api.arthur-ferreiramiran.workers.dev/chat"
).origin

const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com"

// Built from what the generated HTML actually loads, not from a template.
// Two entries that look wrong and are not:
//   - no Google Fonts: next/font self-hosts the woff2 under /_next/static.
//   - script-src 'unsafe-inline': every page carries ~16 inline RSC payload
//     scripts that change per page and per build, so hashing does not scale.
//     A nonce would work but forces dynamic rendering on all 75 static routes,
//     which is the regression this repo already fixed once.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${TURNSTILE_ORIGIN}`,
  // Required: inline style={{...}} in mdx-content/flag-icons, plus next/font.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${CHAT_API_ORIGIN} ${TURNSTILE_ORIGIN}`,
  // Turnstile renders its challenge in an iframe.
  `frame-src ${TURNSTILE_ORIGIN}`,
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
          // Report-Only first: the chat is the likeliest thing to break, and a
          // violation here logs to the console instead of killing the widget.
          // Swap the key to Content-Security-Policy once the reports are clean.
          { key: "Content-Security-Policy-Report-Only", value: csp },
          // Not redundant while the CSP is Report-Only: frame-ancestors above
          // only reports, so this is the header actually refusing to be framed
          // until the policy is enforced.
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

export default withNextIntl(nextConfig)
