import { profile, projects } from "@arthurreira/content"
import { describe, expect, it } from "vitest"

import {
  buildFallbackSystemPrompt,
  buildSystemPrompt,
  DEFAULT_LOCALE,
  FALLBACK_REMINDER,
  isLocale,
  LOCALES,
} from "./portfolio-context"

describe("isLocale", () => {
  it.each(LOCALES)("accepts %s", (locale) => {
    expect(isLocale(locale)).toBe(true)
  })

  it.each([
    ["an unsupported language", "de"],
    ["the wrong case", "EN"],
    ["a regional variant", "pt-BR"],
    ["an empty string", ""],
    ["null", null],
    ["a number", 1],
  ])("rejects %s", (_label, value) => {
    expect(isLocale(value)).toBe(false)
  })
})

describe("buildSystemPrompt", () => {
  it.each([
    ["en", "English"],
    ["fi", "Finnish"],
    ["pt-br", "Brazilian Portuguese"],
  ] as const)("tells the model to reply in %s", (locale, language) => {
    expect(buildSystemPrompt(locale)).toContain(`Reply in ${language}`)
  })

  // Every route is locale-prefixed, so a bare /contact bounces the visitor to
  // the default locale.
  it.each(LOCALES)("prefixes portfolio links with %s", (locale) => {
    const prompt = buildSystemPrompt(locale)

    expect(prompt).toContain(`https://arthurreira.dev/${locale}/projects`)
    expect(prompt).toContain(`/${locale}/contact`)
  })

  it("includes the bio and the project section", () => {
    const prompt = buildSystemPrompt(DEFAULT_LOCALE)

    expect(prompt).toContain("# CONTEXT")
    expect(prompt).toContain("## Projects")
    expect(prompt).toContain("## Credentials and skills")
  })

  // The Velite `content` field is compiled MDX — a JS function, useless as
  // model context. The bio must come from `raw`.
  it.each([
    "_jsx",
    "jsxs(",
    "useMDXComponents",
    "_createMdxContent",
    "_missingMdxReference",
  ])("carries no compiled MDX (%s) into the prompt", (marker) => {
    for (const locale of LOCALES) {
      expect(buildSystemPrompt(locale)).not.toContain(marker)
    }
  })
})

describe("buildSystemPrompt project coverage", () => {
  const slugsIn = (locale: (typeof LOCALES)[number]) =>
    new Set(
      projects.filter((project) => project.locale === locale).map((p) => p.slug)
    )

  // Translations lag, and a visitor reading in Finnish must still hear about
  // every project rather than silently fewer of them.
  it.each(LOCALES)("mentions every project when reading in %s", (locale) => {
    const prompt = buildSystemPrompt(locale)
    const allSlugs = new Set([...slugsIn(locale), ...slugsIn(DEFAULT_LOCALE)])

    for (const slug of allSlugs) {
      const project = projects.find(
        (entry) => entry.slug === slug && entry.locale === locale
      )
      const fallback = projects.find(
        (entry) => entry.slug === slug && entry.locale === DEFAULT_LOCALE
      )
      const title = (project ?? fallback)?.title

      expect(prompt, `missing project: ${slug}`).toContain(title)
    }
  })

  it("never lists the same project twice", () => {
    const prompt = buildSystemPrompt("fi")
    const headings = prompt.match(/^### .+ \(\d{4}\)$/gm) ?? []

    expect(new Set(headings).size).toBe(headings.length)
  })
})

describe("buildSystemPrompt certification coverage", () => {
  it("includes every certification with its area", () => {
    const prompt = buildSystemPrompt(DEFAULT_LOCALE)

    for (const certification of profile.certifications) {
      expect(prompt).toContain(certification.name)
      expect(prompt).toContain(`[${(certification as { area?: string }).area}]`)
    }
  })
})

describe("buildFallbackSystemPrompt", () => {
  // A smaller model drifts; the rules are restated at both ends so neither the
  // beginning nor the end of the window is left unguarded.
  it("wraps the prompt in the hard rules at both ends", () => {
    const prompt = buildFallbackSystemPrompt(DEFAULT_LOCALE)

    expect(prompt.startsWith(FALLBACK_REMINDER)).toBe(true)
    expect(prompt.endsWith(FALLBACK_REMINDER)).toBe(true)
  })

  it("still contains the full context", () => {
    const prompt = buildFallbackSystemPrompt("fi")

    expect(prompt).toContain("# CONTEXT")
    expect(prompt).toContain("Reply in Finnish")
  })

  it("keeps the out-of-scope rule the small model kept breaking", () => {
    expect(FALLBACK_REMINDER).toContain("whose work it is")
  })
})
