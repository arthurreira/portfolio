import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { callerKey, isRateLimited, RETRY_AFTER_SECONDS } from "./rate-limit"

const request = (headers: Record<string, string> = {}) =>
  new Request("https://chat-api.test/chat", { method: "POST", headers })

const limiter = (success: boolean) =>
  ({ limit: vi.fn().mockResolvedValue({ success }) }) as unknown as RateLimit

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("callerKey", () => {
  it("uses the Cloudflare client IP", () => {
    expect(callerKey(request({ "cf-connecting-ip": "203.0.113.7" }))).toBe(
      "203.0.113.7"
    )
  })

  it("falls back to a shared bucket when there is no IP", () => {
    expect(callerKey(request())).toBe("unknown")
  })
})

describe("isRateLimited", () => {
  it("lets a caller under the limit through", async () => {
    expect(await isRateLimited(request(), limiter(true))).toBe(false)
  })

  it("stops a caller over the limit", async () => {
    expect(await isRateLimited(request(), limiter(false))).toBe(true)
  })

  it("keys the limit on the caller IP", async () => {
    const rateLimit = limiter(true)

    await isRateLimited(request({ "cf-connecting-ip": "203.0.113.7" }), rateLimit)

    expect(rateLimit.limit).toHaveBeenCalledWith({ key: "203.0.113.7" })
  })

  // The binding is declared in wrangler.jsonc and absent only in local runs, so
  // a missing limiter means "not throttling", not "refuse everything".
  it("does not throttle when no limiter is bound", async () => {
    expect(await isRateLimited(request(), undefined)).toBe(false)
  })

  it("advertises a retry window", () => {
    expect(RETRY_AFTER_SECONDS).toBe(60)
  })
})
