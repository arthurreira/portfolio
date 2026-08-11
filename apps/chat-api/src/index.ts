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
  /** Turnstile secret. */
  TURNSTILE_SECRET_KEY?: string
  /** "true" in deployed builds (set in wrangler.jsonc). */
  REQUIRE_TURNSTILE?: string
  /**
   * Optional comma-separated CORS allowlist; defaults to the known site
   * origins.
   */
  ALLOWED_ORIGINS?: string
  /** Per-IP throttle, declared in wrangler.jsonc. */
  CHAT_RATE_LIMIT?: RateLimit
  /** Workers AI, used to answer when Anthropic is unavailable. */
  AI?: Ai
}

/**
 * Reads the body, refusing anything past the byte ceiling before parsing it.
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
    console.error("rejected:", validated.error)
    return json({ success: false, error: validated.error }, 400, cors)
  }

  const { messages, turnstileToken, model, locale: requestedLocale } =
    validated.data

  // Guards run cheapest first.
  if (env.CHAT_RATE_LIMIT) {
    const key = request.headers.get("cf-connecting-ip") ?? "unknown"
    const { success } = await env.CHAT_RATE_LIMIT.limit({ key })
    if (!success) {
      console.error("rejected: rate limited", key)
      return json({ success: false, error: "rate_limited" }, 429, {
        ...cors,
        "retry-after": "60",
      })
    }
  }

  // Refuse rather than quietly run unprotected.
  if (env.REQUIRE_TURNSTILE === "true" && !env.TURNSTILE_SECRET_KEY) {
    console.error(
      "REQUIRE_TURNSTILE is set but TURNSTILE_SECRET_KEY is missing"
    )
    return json({ success: false, error: "not_configured" }, 500, cors)
  }

  if (env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      // Logged, not silent.
      console.error("rejected: no turnstile token in request")
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
