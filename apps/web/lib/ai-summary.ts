import { readFile } from "node:fs/promises"
import path from "node:path"

import { routing } from "@/i18n/routing"

export type AiSummary = {
  summary: string
  disclosure: string
}

/**
 * The JSON files are written by `pnpm --filter @arthurreira/content ai:summary`
 * and live next to the MDX they describe. Velite ignores them (its glob is
 * `projects/**\/*.mdx`), so they are read straight off disk.
 */
const SUMMARY_ROOT = path.join(
  process.cwd(),
  "..",
  "..",
  "packages",
  "content",
  "projects"
)

const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*$/

function isLocale(value: string): boolean {
  return (routing.locales as readonly string[]).includes(value)
}

/** The file is generated output, so its shape is checked before it is trusted. */
function parseSummary(raw: string): AiSummary | undefined {
  const data: unknown = JSON.parse(raw)

  if (typeof data !== "object" || data === null) return undefined

  const { summary, disclosure } = data as Record<string, unknown>

  if (typeof summary !== "string" || !summary.trim()) return undefined
  if (typeof disclosure !== "string" || !disclosure.trim()) return undefined

  return { summary, disclosure }
}

/**
 * Returns undefined for any project that has no generated summary yet — the
 * common case, and never an error: generation is opt-in and per project.
 */
export async function readAiSummary(
  slug: string,
  locale: string
): Promise<AiSummary | undefined> {
  // `slug` reaches this from the URL, so it is validated before it becomes a path.
  if (!SAFE_SLUG.test(slug) || !isLocale(locale)) return undefined

  const file = path.join(SUMMARY_ROOT, slug, `ai-summary.${locale}.json`)

  try {
    return parseSummary(await readFile(file, "utf8"))
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code !== "ENOENT") {
      console.error(`[ai-summary] could not read ${file}:`, error)
    }
    return undefined
  }
}
