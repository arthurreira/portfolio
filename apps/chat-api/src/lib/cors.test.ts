import { describe, expect, it } from "vitest"

import { corsHeaders, parseAllowedOrigins } from "./cors"
import { DEGRADED_HEADER } from "./headers"

const FALLBACKS = [
  "https://arthurreira.dev",
  "https://www.arthurreira.dev",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]

describe("parseAllowedOrigins", () => {
  it.each([
    ["undefined", undefined],
    ["empty", ""],
    ["only commas", ",,,"],
    ["only whitespace", "  ,  "],
  ])("falls back to the site origins when the binding is %s", (_l, value) => {
    expect(parseAllowedOrigins(value)).toEqual(FALLBACKS)
  })

  it("splits and trims a configured list", () => {
    expect(parseAllowedOrigins(" https://a.dev , https://b.dev ")).toEqual([
      "https://a.dev",
      "https://b.dev",
    ])
  })

  it("replaces the fallbacks rather than extending them", () => {
    const origins = parseAllowedOrigins("https://staging.arthurreira.dev")

    expect(origins).toEqual(["https://staging.arthurreira.dev"])
    expect(origins).not.toContain("https://arthurreira.dev")
  })

  // Both dev spellings are distinct origins; allowlisting one blocks the other.
  it("keeps localhost and 127.0.0.1 as separate fallbacks", () => {
    const origins = parseAllowedOrigins()

    expect(origins).toContain("http://localhost:3000")
    expect(origins).toContain("http://127.0.0.1:3000")
  })
})

describe("corsHeaders", () => {
  it("returns headers for an allowlisted origin", () => {
    const headers = corsHeaders("https://arthurreira.dev", FALLBACKS)

    expect(headers["access-control-allow-origin"]).toBe(
      "https://arthurreira.dev"
    )
    expect(headers.vary).toBe("origin")
  })

  it.each([
    ["a null origin", null],
    ["an empty origin", ""],
    ["an origin not on the list", "https://evil.dev"],
    ["a subdomain of an allowed origin", "https://evil.arthurreira.dev"],
    ["the same origin over http", "http://arthurreira.dev"],
    ["a trailing slash", "https://arthurreira.dev/"],
  ])("returns nothing for %s", (_label, origin) => {
    expect(corsHeaders(origin, FALLBACKS)).toEqual({})
  })

  // Without this the degraded-mode flag would be set and unreadable in the page.
  it("exposes the degraded header to page scripts", () => {
    const headers = corsHeaders("https://arthurreira.dev", FALLBACKS)

    expect(headers["access-control-expose-headers"]).toBe(DEGRADED_HEADER)
  })

  it("reflects only the requesting origin, never a wildcard", () => {
    const headers = corsHeaders("https://www.arthurreira.dev", FALLBACKS)

    expect(headers["access-control-allow-origin"]).not.toBe("*")
    expect(headers["access-control-allow-origin"]).toBe(
      "https://www.arthurreira.dev"
    )
  })
})
