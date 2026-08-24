import { describe, expect, it } from "vitest"

import { resolveLocale } from "./resolve-locale"
import { routing } from "./routing"

describe("resolveLocale", () => {
  it.each(routing.locales)("passes %s through untouched", (locale) => {
    expect(resolveLocale(locale)).toBe(locale)
  })

  it("falls back when nothing was requested", () => {
    expect(resolveLocale(undefined)).toBe(routing.defaultLocale)
  })

  // Each of these reached `import("../messages/<value>.json")` before the
  // fallback existed, and a missing file throws at request time — a 500 where
  // the visitor should have seen a 404.
  it.each([
    ["a scanner probing for PHP", "admin.php"],
    ["a path traversal attempt", "../../etc/passwd"],
    ["an unsupported language", "de"],
    ["a regional variant of a supported one", "en-US"],
    ["the empty string", ""],
    ["a supported locale in the wrong case", "EN"],
    ["a supported locale with whitespace", " en "],
  ])("falls back for %s", (_label, requested) => {
    expect(resolveLocale(requested)).toBe(routing.defaultLocale)
  })

  // The fallback is only safe because the default is itself loadable.
  it("returns a locale the app has messages for", () => {
    expect(routing.locales).toContain(resolveLocale("admin.php"))
  })
})
