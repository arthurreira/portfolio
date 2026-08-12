import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { callArg } from "./test-support/mock-calls"
import worker, { type Env } from "./index"

interface StreamChatArgs {
  apiKey: string
  config: { maxOutputTokens: number }
  systemPrompt: string
  model: string
  headers: Record<string, string>
}

const chatArgs = () => callArg<StreamChatArgs>(streamChat)

const streamChat = vi.hoisted(() => vi.fn())
const verifyTurnstile = vi.hoisted(() => vi.fn())

vi.mock("./chat/chat", () => ({ streamChat }))
vi.mock("./security/turnstile", () => ({ verifyTurnstile }))

const ORIGIN = "https://arthurreira.dev"

const env = (overrides: Partial<Env> = {}): Env =>
  ({ ANTHROPIC_API_KEY: "sk-test", ...overrides }) as Env

const chatRequest = (
  body: unknown,
  { headers = {} }: { headers?: Record<string, string> } = {}
) =>
  new Request("https://chat-api.test/chat", {
    method: "POST",
    headers: { origin: ORIGIN, "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })

const validBody = {
  messages: [
    { role: "user", parts: [{ type: "text", text: "Who is Arthur?" }] },
  ],
}

const rateLimiter = (success: boolean) =>
  ({ limit: vi.fn().mockResolvedValue({ success }) }) as unknown as RateLimit

beforeEach(() => {
  streamChat.mockResolvedValue(new Response("stream"))
  verifyTurnstile.mockResolvedValue(true)
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe("routing", () => {
  it("answers a preflight with 204 and CORS headers", async () => {
    const response = await worker.fetch(
      new Request("https://chat-api.test/chat", {
        method: "OPTIONS",
        headers: { origin: ORIGIN },
      }),
      env()
    )

    expect(response.status).toBe(204)
    expect(response.headers.get("access-control-allow-origin")).toBe(ORIGIN)
  })

  it("serves the health check", async () => {
    const response = await worker.fetch(
      new Request("https://chat-api.test/health"),
      env()
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      success: true,
      data: { status: "ok" },
    })
  })

  it.each([
    ["an unknown path", "https://chat-api.test/admin", "GET"],
    ["chat over GET", "https://chat-api.test/chat", "GET"],
    ["health over POST", "https://chat-api.test/health", "POST"],
  ])("404s on %s", async (_label, url, method) => {
    const response = await worker.fetch(new Request(url, { method }), env())

    expect(response.status).toBe(404)
  })

  it("omits CORS headers for an origin that is not allowlisted", async () => {
    const response = await worker.fetch(
      chatRequest(validBody, { headers: { origin: "https://evil.dev" } }),
      env()
    )

    expect(response.headers.get("access-control-allow-origin")).toBeNull()
  })
})

describe("body limits", () => {
  it("refuses an oversized declared content-length before reading", async () => {
    const response = await worker.fetch(
      chatRequest(validBody, { headers: { "content-length": "999999" } }),
      env()
    )

    expect(response.status).toBe(413)
    expect(await response.json()).toMatchObject({ error: "payload_too_large" })
  })

  it("refuses an oversized body that under-declares its length", async () => {
    const response = await worker.fetch(
      chatRequest({
        messages: [
          {
            role: "user",
            parts: [{ type: "text", text: "a".repeat(200_000) }],
          },
        ],
      }),
      env()
    )

    expect(response.status).toBe(413)
  })

  it("rejects a body that is not JSON", async () => {
    const response = await worker.fetch(chatRequest("{nope"), env())

    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({ error: "invalid_json" })
  })

  it("passes a validation error through with its own code", async () => {
    const response = await worker.fetch(chatRequest({ messages: [] }), env())

    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({ error: "invalid_messages" })
  })
})

describe("rate limiting", () => {
  it("stops a throttled caller with a retry hint", async () => {
    const response = await worker.fetch(
      chatRequest(validBody, {
        headers: { "cf-connecting-ip": "203.0.113.7" },
      }),
      env({ CHAT_RATE_LIMIT: rateLimiter(false) })
    )

    expect(response.status).toBe(429)
    expect(response.headers.get("retry-after")).toBe("60")
    expect(streamChat).not.toHaveBeenCalled()
  })

  it("keys the limit on the caller IP", async () => {
    const limiter = rateLimiter(true)

    await worker.fetch(
      chatRequest(validBody, {
        headers: { "cf-connecting-ip": "203.0.113.7" },
      }),
      env({ CHAT_RATE_LIMIT: limiter })
    )

    expect(limiter.limit).toHaveBeenCalledWith({ key: "203.0.113.7" })
  })

  // Cheapest guard first: throttling must not depend on a Turnstile round trip.
  it("throttles before verifying Turnstile", async () => {
    await worker.fetch(
      chatRequest({ ...validBody, turnstileToken: "t" }),
      env({ CHAT_RATE_LIMIT: rateLimiter(false), TURNSTILE_SECRET_KEY: "s" })
    )

    expect(verifyTurnstile).not.toHaveBeenCalled()
  })
})

describe("turnstile enforcement", () => {
  // Refusing beats quietly running unprotected.
  it("refuses to serve when required but not configured", async () => {
    const response = await worker.fetch(
      chatRequest(validBody),
      env({ REQUIRE_TURNSTILE: "true" })
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({ error: "not_configured" })
    expect(streamChat).not.toHaveBeenCalled()
  })

  it("rejects a request with no token once a secret is set", async () => {
    const response = await worker.fetch(
      chatRequest(validBody),
      env({ TURNSTILE_SECRET_KEY: "secret" })
    )

    expect(response.status).toBe(403)
    expect(await response.json()).toMatchObject({ error: "turnstile_missing" })
  })

  it("rejects a token Cloudflare refuses", async () => {
    verifyTurnstile.mockResolvedValue(false)

    const response = await worker.fetch(
      chatRequest({ ...validBody, turnstileToken: "forged" }),
      env({ TURNSTILE_SECRET_KEY: "secret" })
    )

    expect(response.status).toBe(403)
    expect(await response.json()).toMatchObject({ error: "turnstile_failed" })
    expect(streamChat).not.toHaveBeenCalled()
  })

  it("passes the caller IP to the verifier", async () => {
    await worker.fetch(
      chatRequest(
        { ...validBody, turnstileToken: "token" },
        { headers: { "cf-connecting-ip": "203.0.113.7" } }
      ),
      env({ TURNSTILE_SECRET_KEY: "secret" })
    )

    expect(verifyTurnstile).toHaveBeenCalledWith(
      "token",
      "secret",
      "203.0.113.7"
    )
  })

  it("skips the check entirely when no secret is set", async () => {
    const response = await worker.fetch(chatRequest(validBody), env())

    expect(verifyTurnstile).not.toHaveBeenCalled()
    expect(response.status).toBe(200)
  })
})

describe("model configuration", () => {
  it("refuses when the API key is missing", async () => {
    const response = await worker.fetch(
      chatRequest(validBody),
      env({ ANTHROPIC_API_KEY: "" })
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({ error: "not_configured" })
    expect(streamChat).not.toHaveBeenCalled()
  })

  it("hands the resolved config to the streamer", async () => {
    await worker.fetch(
      chatRequest(validBody),
      env({ CHAT_MAX_OUTPUT_TOKENS: "999999" })
    )

    const args = chatArgs()
    expect(args.apiKey).toBe("sk-test")
    // The ceiling still applies on the path an actual request takes.
    expect(args.config.maxOutputTokens).toBe(2048)
  })

  it("builds the prompt in the requested locale", async () => {
    await worker.fetch(chatRequest({ ...validBody, locale: "fi" }), env())

    const args = chatArgs()
    expect(args.systemPrompt).toContain("Reply in Finnish")
  })

  it.each([
    ["an unsupported locale", "de"],
    ["a malformed locale", "!!"],
    ["no locale at all", undefined],
  ])("falls back to English for %s", async (_label, locale) => {
    await worker.fetch(chatRequest({ ...validBody, locale }), env())

    const args = chatArgs()
    expect(args.systemPrompt).toContain("Reply in English")
  })

  it("forwards the visitor's model choice", async () => {
    await worker.fetch(
      chatRequest({ ...validBody, model: "workers-ai" }),
      env()
    )

    expect(chatArgs().model).toBe("workers-ai")
  })

  it("attaches CORS headers to the streamed response", async () => {
    await worker.fetch(chatRequest(validBody), env())

    const args = chatArgs()
    expect(args.headers["access-control-allow-origin"]).toBe(ORIGIN)
  })
})
