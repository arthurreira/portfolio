import { projects } from "@arthurreira/content"

/**
 * Turns plain-text mentions of Arthur's projects in assistant answers into
 * links to the project pages. The matching happens here, against the known
 * catalogue — the model is never asked to emit portfolio URLs, because a model
 * inventing a URL is a broken link.
 */

interface ProjectAlias {
  alias: string
  slug: string
  caseSensitive: boolean
}

/**
 * Titles match case-sensitively: the model copies them from its context with
 * exact casing, and "Infrastructure as Code" the project must not swallow
 * "infrastructure as code" the concept.
 *
 * Slugs are added as case-insensitive aliases only when hyphenated — visitors
 * and the model both write "af-analytics", but bare-word slugs like "infra"
 * and "portfolio" are ordinary vocabulary and would link half the prose.
 */
const aliasesForLocale = (locale: string): ProjectAlias[] => {
  const translated = projects.filter((project) => project.locale === locale)
  const translatedSlugs = new Set(translated.map((project) => project.slug))
  const fallback = projects.filter(
    (project) => project.locale === "en" && !translatedSlugs.has(project.slug)
  )

  const aliases: ProjectAlias[] = []
  for (const project of [...translated, ...fallback]) {
    const { title, slug } = project
    if (!title || !slug) continue
    aliases.push({ alias: title, slug, caseSensitive: true })
    if (slug.includes("-")) {
      aliases.push({ alias: slug, slug, caseSensitive: false })
    }
  }

  // Longest first, so "AF Next.js Component Architecture" is not half-eaten by
  // a shorter alias that happens to be its prefix.
  return aliases.sort((a, b) => b.alias.length - a.alias.length)
}

const aliasCache = new Map<string, ProjectAlias[]>()

const getAliases = (locale: string): ProjectAlias[] => {
  const cached = aliasCache.get(locale)
  if (cached) return cached
  const built = aliasesForLocale(locale)
  aliasCache.set(locale, built)
  return built
}

/**
 * Segments that must never be rewritten: fenced code, inline code, anything
 * already a markdown link, and bare URLs (which the model produces and GFM
 * autolinks). Splitting on a capture group keeps them at the odd indices.
 */
const PROTECTED_SEGMENTS = /(```[\s\S]*?```|`[^`]*`|\[[^\]]*\]\([^)]*\)|https?:\/\/\S+)/g

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * The lookarounds keep a match from starting or ending inside a word, a path,
 * or a link this function inserted one alias earlier — `[` and `]` are in the
 * exclusion sets so a second alias for the same project cannot nest a link
 * inside the first one's text.
 */
const aliasPattern = ({ alias, caseSensitive }: ProjectAlias): RegExp =>
  new RegExp(
    `(?<![\\w/.@[-])${escapeRegExp(alias)}(?![\\w/\\]-])`,
    caseSensitive ? "g" : "gi"
  )

const linkifySegment = (segment: string, locale: string): string => {
  let result = segment
  for (const entry of getAliases(locale)) {
    result = result.replace(
      aliasPattern(entry),
      (match) => `[${match}](/${locale}/projects/${entry.slug})`
    )
  }
  return result
}

/** Rewrites plain-text project mentions in `markdown` into portfolio links. */
export const linkifyProjects = (markdown: string, locale: string): string =>
  markdown
    .split(PROTECTED_SEGMENTS)
    .map((segment, index) =>
      index % 2 === 1 ? segment : linkifySegment(segment, locale)
    )
    .join("")
