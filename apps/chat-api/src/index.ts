import type { UIMessage } from "ai"
import { corsHeaders, parseAllowedOrigins } from "./lib/cors"
import { json } from "./lib/response"
import { streamChat } from "./lib/chat"
import { resolveChatConfig, type ChatConfigEnv } from "./lib/config"
import { verifyTurnstile } from "./lib/turnstile"
import {
  buildSystemPrompt,
  DEFAULT_LOCALE,
  isLocale,
} from "./lib/portfolio-context"

export interface Env extends ChatConfigEnv {
  /** Set with `wrangler secret put ANTHROPIC_API_KEY`. */
  ANTHROPIC_API_KEY: string
  /** Turnstile secret. Set with `wrangler secret put TURNSTILE_SECRET_KEY`. */
  TURNSTILE_SECRET_KEY?: string
  /**
   * "true" in deployed builds (set in wrangler.jsonc). Turns a missing
   * Turnstile secret into a hard failure instead of a silently skipped check.
   */
  REQUIRE_TURNSTILE?: string
  /** Optional comma-separated CORS allowlist; defaults to the known site origins. */
  ALLOWED_ORIGINS?: string
  /** Per-IP throttle, declared in wrangler.jsonc. */
  CHAT_RATE_LIMIT?: RateLimit
}

/** `useChat` posts AI SDK UIMessages: a role plus an array of parts. */
const isUIMessage = (value: unknown): value is UIMessage => {
  if (typeof value !== "object" || value === null) return false
  const { role, parts } = value as Partial<UIMessage>
  return (
    (role === "user" || role === "assistant" || role === "system") &&
    Array.isArray(parts)
  )
}

/**
 * Shape check only — size limits and history trimming land with the
 * validation work, so this just rejects structurally invalid payloads.
 */
const parseMessages = (payload: unknown): UIMessage[] | null => {
  if (typeof payload !== "object" || payload === null) return null
  const { messages } = payload as { messages?: unknown }
  if (!Array.isArray(messages) || messages.length === 0) return null
  return messages.every(isUIMessage) ? messages : null
}

const handleChat = async (
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> => {
  // Validate the request before checking server config, so a malformed payload
  // reports as a client error (400) rather than being masked as a 500.
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json({ success: false, error: "invalid_json" }, 400, cors)
  }

  const messages = parseMessages(payload)
  if (!messages) {
    return json({ success: false, error: "invalid_messages" }, 400, cors)
  }

  // Guards run cheapest first. The throttle is a local counter with no network
  // call, so it goes ahead of Turnstile — a flood costs nothing to refuse.
  // cf-connecting-ip is set by Cloudflare and cannot be spoofed by the client;
  // the fallback only matters when running outside their network.
  if (env.CHAT_RATE_LIMIT) {
    const key = request.headers.get("cf-connecting-ip") ?? "unknown"
    const { success } = await env.CHAT_RATE_LIMIT.limit({ key })
    if (!success) {
      return json({ success: false, error: "rate_limited" }, 429, {
        ...cors,
        "retry-after": "60",
      })
    }
  }

  // Refuse rather than quietly run unprotected. Skipping the check is a local
  // convenience; in a deployed build a missing secret is a misconfiguration,
  // and one nobody would notice if it just disabled bot protection.
  if (env.REQUIRE_TURNSTILE === "true" && !env.TURNSTILE_SECRET_KEY) {
    console.error(
      "REQUIRE_TURNSTILE is set but TURNSTILE_SECRET_KEY is missing"
    )
    return json({ success: false, error: "not_configured" }, 500, cors)
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const { turnstileToken } = payload as { turnstileToken?: unknown }
    if (typeof turnstileToken !== "string" || !turnstileToken) {
      return json({ success: false, error: "turnstile_missing" }, 403, cors)
    }

    const human = await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request.headers.get("cf-connecting-ip") ?? undefined
    )
    if (!human) {
      return json({ success: false, error: "turnstile_failed" }, 403, cors)
    }
  }

  if (!env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not configured")
    return json({ success: false, error: "not_configured" }, 500, cors)
  }

  const { locale } = payload as { locale?: unknown }
  const systemPrompt = buildSystemPrompt(
    isLocale(locale) ? locale : DEFAULT_LOCALE
  )

  return streamChat({
    apiKey: env.ANTHROPIC_API_KEY,
    config: resolveChatConfig(env),
    systemPrompt,
    messages,
    headers: cors,
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    const cors = corsHeaders(
      request.headers.get("origin"),
      parseAllowedOrigins(env.ALLOWED_ORIGINS)
    )

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method === "GET" && pathname === "/health") {
      return json({ success: true, data: { status: "ok" } }, 200, cors)
    }

    if (request.method === "POST" && pathname === "/chat") {
      return handleChat(request, env, cors)
    }

    return json({ success: false, error: "not_found" }, 404, cors)
  },
} satisfies ExportedHandler<Env>
