import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { callArg } from "../test-support/mock-calls"
import { verifyTurnstile } from "./turnstile"

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

const mockFetch = (implementation: () => Promise<unknown>) => {
  const fetchMock = vi.fn().mockImplementation(implementation)
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

const ok = (body: unknown) =>
  ({ ok: true, status: 200, json: async () => body }) as unknown as Response

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("verifyTurnstile", () => {
  it("accepts a token Cloudflare confirms", async () => {
    mockFetch(async () => ok({ success: true }))

    expect(await verifyTurnstile("token", "secret")).toBe(true)
  })

  it("rejects a token Cloudflare refuses", async () => {
    mockFetch(async () => ok({ success: false, "error-codes": ["bad-token"] }))

    expect(await verifyTurnstile("token", "secret")).toBe(false)
  })

  it("posts the secret and token to the verify endpoint", async () => {
    const fetchMock = mockFetch(async () => ok({ success: true }))

    await verifyTurnstile("token-abc", "secret-xyz")

    expect(callArg<string>(fetchMock, 0)).toBe(VERIFY_URL)

    const init = callArg<RequestInit>(fetchMock, 1)
    expect(init.method).toBe("POST")

    const body = init.body as FormData
    expect(body.get("secret")).toBe("secret-xyz")
    expect(body.get("response")).toBe("token-abc")
    expect(body.get("remoteip")).toBeNull()
  })

  it("includes the caller IP when there is one", async () => {
    const fetchMock = mockFetch(async () => ok({ success: true }))

    await verifyTurnstile("token", "secret", "203.0.113.7")

    const body = callArg<RequestInit>(fetchMock, 1).body as FormData
    expect(body.get("remoteip")).toBe("203.0.113.7")
  })
})

describe("verifyTurnstile failure handling", () => {
  // Failing closed matters here: failing open would make the widget optional
  // to anyone who can break the verify call.
  it("fails closed on a non-OK response", async () => {
    mockFetch(async () => ({ ok: false, status: 503 }) as unknown as Response)

    expect(await verifyTurnstile("token", "secret")).toBe(false)
  })

  it("fails closed when the request throws", async () => {
    mockFetch(async () => {
      throw new Error("network down")
    })

    expect(await verifyTurnstile("token", "secret")).toBe(false)
  })

  it("fails closed when the body is not JSON", async () => {
    mockFetch(
      async () =>
        ({
          ok: true,
          status: 200,
          json: async () => {
            throw new Error("not json")
          },
        }) as unknown as Response
    )

    expect(await verifyTurnstile("token", "secret")).toBe(false)
  })
})
