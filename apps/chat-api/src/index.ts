import { corsHeaders, parseAllowedOrigins } from "./lib/cors"
import { json } from "./lib/response"
import { streamChat } from "./lib/chat"
import { resolveChatConfig, type ChatConfigEnv } from "./lib/config"
import { verifyTurnstile } from "./lib/turnstile"
import { MAX_BODY_BYTES, validateChatRequest } from "./lib/validation"
import {
  buildFallbackSystemPrompt,
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
  /**
   * Workers AI, used to answer when Anthropic is unavailable. Optional so the
   * Worker still runs in a local session started without the binding.
   */
  AI?: Ai
}

/**
 * Reads the body, refusing anything past the byte ceiling before parsing it.
 *
 * `content-length` is checked first because it is free, but it is a claim by
 * the client rather than a fact — a chunked request may not send one at all.
 * The decoded size is therefore checked again for real.
 */
const readBoundedJson = async (request: Request): Promise<unknown | symbol> => {
  const declared = Number(request.headers.get("content-length"))
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return TOO_LARGE

  const raw = await request.arrayBuffer()
  if (raw.byteLength > MAX_BODY_BYTES) return TOO_LARGE

  return JSON.parse(new TextDecoder().decode(raw)) as unknown
}

const TOO_LARGE = Symbol("too_large")

const handleChat = async (
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> => {
  // Validate the request before checking server config, so a malformed payload
  // reports as a client error rather than being masked as a 500.
  let payload: unknown
  try {
    payload = await readBoundedJson(request)
  } catch {
    return json({ success: false, error: "invalid_json" }, 400, cors)
  }

  if (payload === TOO_LARGE) {
    return json({ success: false, error: "payload_too_large" }, 413, cors)
  }

  const validated = validateChatRequest(payload)
  if (!validated.ok) {
    return json({ success: false, error: validated.error }, 400, cors)
  }

  const { messages, turnstileToken, model, locale: requestedLocale } =
    validated.data

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
    if (!turnstileToken) {
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

  const locale = isLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE
  const systemPrompt = buildSystemPrompt(locale)

  return streamChat({
    apiKey: env.ANTHROPIC_API_KEY,
    config: resolveChatConfig(env),
    systemPrompt,
    fallbackSystemPrompt: buildFallbackSystemPrompt(locale),
    messages,
    headers: cors,
    ai: env.AI,
    model,
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
