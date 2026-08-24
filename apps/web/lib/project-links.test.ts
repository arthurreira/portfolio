import { describe, expect, it, vi } from "vitest"
import type { Project } from "@arthurreira/content"

/**
 * The fixture is typed as the real `Project`, so a change to the Velite schema
 * in `packages/content/velite.config.ts` fails the typecheck here rather than
 * leaving a mock that quietly no longer resembles the data.
 *
 * Every row exists to carry one hazard the real content happens to contain:
 * a regex metacharacter in a title, a title identical to its own slug, a slug
 * that is a prefix of another, and a project translated in `en` only.
 */
const { PROJECTS } = vi.hoisted(() => {
  const row = (locale: string, slug: string, title: string): Project => ({
    title,
    slug,
    locale,
    description: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    content: "",
    featured: false,
    status: "done",
    permalink: `/project/${slug}`,
  })

  const shared = (locale: string): Project[] => [
    row(locale, "af-analytics", "AF Analytics"),
    // Its own title is a prefix of this one; only the longest-first sort keeps
    // the shorter alias from eating the front of it.
    row(locale, "af-analytics-pro", "AF Analytics Pro"),
    // No hyphen in the slug, so the title is this project's only alias.
    row(locale, "infra", "Infrastructure as Code"),
    // "|" is regex alternation if it is ever left unescaped.
    row(locale, "vr-pc-builder", "VR | PC Builder"),
    // "." matches any character if it is ever left unescaped, and the title is
    // also a hostname that shows up inside URLs.
    row(locale, "portfolio", "arthurreira.dev"),
    // Title identical to the slug: two aliases with the same text, one
    // case-sensitive and one not.
    row(locale, "br-state-flags", "br-state-flags"),
  ]

  return {
    PROJECTS: [
      ...shared("en"),
      row("en", "muistipeli", "Memory Game"),
      // Deliberately absent from `fi` — this is the untranslated case.
      row("en", "honor-notes", "Honor Notes"),
      ...shared("fi"),
      row("fi", "muistipeli", "Muistipeli"),
    ],
  }
})

vi.mock("@arthurreira/content", () => ({ projects: PROJECTS }))

const { linkifyProjects } = await import("./project-links")

describe("linkifyProjects — linking", () => {
  it("links a title mention", () => {
    expect(linkifyProjects("I built AF Analytics in 2026.", "en")).toBe(
      "I built [AF Analytics](/en/projects/af-analytics) in 2026."
    )
  })

  it("links a slug mention regardless of case", () => {
    expect(linkifyProjects("see AF-ANALYTICS", "en")).toBe(
      "see [AF-ANALYTICS](/en/projects/af-analytics)"
    )
  })

  it("leaves text with no project mention byte-identical", () => {
    const text = "Arthur works with TypeScript, Terraform and PostgreSQL."

    expect(linkifyProjects(text, "en")).toBe(text)
  })
})

describe("linkifyProjects — protected segments", () => {
  it("leaves a fenced code block alone", () => {
    const text = "```\nAF Analytics\n```"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("leaves inline code alone", () => {
    const text = "run `AF Analytics` here"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("does not rewrite a markdown link that already exists", () => {
    const text = "[AF Analytics](/en/projects/af-analytics)"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("leaves a bare URL alone", () => {
    const text = "docs at https://arthurreira.dev/en/projects/portfolio today"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  // The split/rejoin keeps every odd-indexed segment verbatim; an off-by-one
  // there would drop content rather than fail loudly.
  it("still links the text around a protected segment", () => {
    expect(
      linkifyProjects("AF Analytics and `AF Analytics` and AF Analytics", "en")
    ).toBe(
      "[AF Analytics](/en/projects/af-analytics) and `AF Analytics` and " +
        "[AF Analytics](/en/projects/af-analytics)"
    )
  })
})

describe("linkifyProjects — alias hazards", () => {
  it("links a title with its documented casing", () => {
    expect(linkifyProjects("built with Infrastructure as Code", "en")).toBe(
      "built with [Infrastructure as Code](/en/projects/infra)"
    )
  })

  it("leaves the lowercase concept alone", () => {
    const text = "he uses infrastructure as code at work"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("escapes a pipe in a title instead of treating it as alternation", () => {
    expect(linkifyProjects("the VR | PC Builder demo", "en")).toBe(
      "the [VR | PC Builder](/en/projects/vr-pc-builder) demo"
    )
  })

  it("does not match half of a piped title", () => {
    const text = "VR | Something Unrelated"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("escapes a dot in a title instead of matching any character", () => {
    const text = "arthurreiraXdev is not the site"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("links a title that is identical to its slug exactly once", () => {
    expect(linkifyProjects("br-state-flags", "en")).toBe(
      "[br-state-flags](/en/projects/br-state-flags)"
    )
  })

  it("does not match inside a longer word", () => {
    const text = "af-analytics-v2 is a different thing"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("does not match inside a path", () => {
    const text = "go to /en/projects/af-analytics for more"

    expect(linkifyProjects(text, "en")).toBe(text)
  })

  it("prefers the longest alias when one is a prefix of another", () => {
    expect(linkifyProjects("AF Analytics Pro shipped", "en")).toBe(
      "[AF Analytics Pro](/en/projects/af-analytics-pro) shipped"
    )
  })
})

describe("linkifyProjects — locale", () => {
  it("prefixes the href with the requested locale", () => {
    expect(linkifyProjects("AF Analytics", "fi")).toBe(
      "[AF Analytics](/fi/projects/af-analytics)"
    )
  })

  it("uses the title of the requested locale", () => {
    expect(linkifyProjects("Muistipeli", "fi")).toBe(
      "[Muistipeli](/fi/projects/muistipeli)"
    )
  })

  it("does not use another locale's title", () => {
    const text = "Memory Game"

    expect(linkifyProjects(text, "fi")).toBe(text)
  })

  // Translations lag; an untranslated project still has to be linkable.
  it("falls back to the English title for an untranslated project", () => {
    expect(linkifyProjects("Honor Notes", "fi")).toBe(
      "[Honor Notes](/fi/projects/honor-notes)"
    )
  })
})
