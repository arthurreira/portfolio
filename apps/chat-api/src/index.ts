import type { UIMessage } from "ai"
import { corsHeaders, parseAllowedOrigins } from "./lib/cors"
import { json } from "./lib/response"
import { streamChat } from "./lib/chat"
import { resolveChatConfig, type ChatConfigEnv } from "./lib/config"
import {
  buildSystemPrompt,
  DEFAULT_LOCALE,
  isLocale,
} from "./lib/portfolio-context"

export interface Env extends ChatConfigEnv {
  /** The only secret here. Set with `wrangler secret put ANTHROPIC_API_KEY`. */
  ANTHROPIC_API_KEY: string
  /** Optional comma-separated CORS allowlist; defaults to the known site origins. */
  ALLOWED_ORIGINS?: string
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
