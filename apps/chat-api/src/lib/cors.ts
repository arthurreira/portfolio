import { DEGRADED_HEADER } from "./headers"

const FALLBACK_ORIGINS = [
  "https://arthurreira.dev",
  "https://www.arthurreira.dev",
  // Both dev spellings: the browser sends whichever host you typed, and they
  // are distinct origins, so allowlisting only one silently blocks the other.
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]

/** Parses the comma-separated ALLOWED_ORIGINS binding, falling back to the known site origins. */
export const parseAllowedOrigins = (configured?: string): string[] => {
  const entries = (configured ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

  return entries.length > 0 ? entries : FALLBACK_ORIGINS
}

/** Returns CORS headers only when the request origin is allowlisted. */
export const corsHeaders = (
  origin: string | null,
  allowedOrigins: string[]
): Record<string, string> => {
  if (!origin || !allowedOrigins.includes(origin)) return {}

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    // Response headers are invisible to cross-origin page scripts unless named
    // here, so without this the degraded-mode flag would be set and unreadable.
    "access-control-expose-headers": DEGRADED_HEADER,
    "access-control-max-age": "86400",
    vary: "origin",
  }
}
