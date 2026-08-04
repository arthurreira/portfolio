import { about, projects } from "@arthurreira/content"

export const LOCALES = ["en", "fi", "pt-br"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  fi: "Finnish",
  "pt-br": "Brazilian Portuguese",
}

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value)

type PortfolioProject = (typeof projects)[number]

/**
 * Renders one project as plain text. Only the structured metadata is used —
 * the `content` field is compiled MDX (a JS function), not readable prose.
 */
const formatProject = (project: PortfolioProject): string => {
  const year = new Date(project.createdAt).getFullYear()
  const lines = [`### ${project.title} (${year})`, project.description]

  if (project.highlight) lines.push(`Highlight: ${project.highlight}`)
  if (project.techStack?.length) lines.push(`Tech: ${project.techStack.join(", ")}`)
  if (project.role) lines.push(`Role: ${project.role}`)
  lines.push(`Status: ${project.status}`)
  if (project.url) lines.push(`Live: ${project.url}`)
  if (project.githubRepo) lines.push(`Source: ${project.githubRepo}`)

  return lines.join("\n")
}

/**
 * Builds the cacheable system prompt for a locale: instructions, Arthur's bio,
 * and every project in that locale. Stable across requests, so it is sent as a
 * prompt-cache prefix.
 *
 * Note: measured at ~3k tokens per locale, which is below Haiku 4.5's 4096-token
 * minimum cacheable prefix — so the `cache_control` breakpoint currently no-ops.
 * That is the cheaper trade at portfolio traffic: a bigger prompt would cache,
 * but sporadic visitors would mostly pay the 1.25x cache-write premium instead
 * of reading it back. Re-evaluate with `usage.cache_read_input_tokens` if the
 * context grows or traffic becomes steady.
 */
export const buildSystemPrompt = (locale: Locale): string => {
  const bio = about.find((entry) => entry.locale === locale)?.raw ?? ""
  const localeProjects = projects
    .filter((project) => project.locale === locale)
    .sort((a, b) => Number(b.featured) - Number(a.featured))

  return [
    "You are the assistant on Arthur Ferreira's developer portfolio (arthurreira.dev).",
    "You answer visitors' questions about Arthur — his background, experience, and projects.",
    "",
    "Rules:",
    `- Reply in ${LANGUAGE_NAMES[locale]}.`,
    "- Use only the context below. If it does not cover the question, say so plainly and point the visitor to the contact page.",
    "- Never invent projects, employers, dates, or technologies.",
    "- Keep answers short and conversational — 2-4 sentences unless asked for detail.",
    "- Link to a project's live URL or source when it helps.",
    // Every route is locale-prefixed (next-intl `localePrefix: 'always'`), so a
    // bare /contact would bounce an English visitor to the default locale.
    `- When linking to the portfolio itself, always prefix the locale: https://arthurreira.dev/${locale}/contact, /${locale}/projects, /${locale}/about.`,
    "- If asked about something unrelated to Arthur or his work, politely redirect.",
    "",
    "## About Arthur",
    bio,
    "",
    "## Projects",
    localeProjects.map(formatProject).join("\n\n"),
  ].join("\n")
}
