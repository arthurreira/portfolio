import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  PROMPT_VERSION,
  type ProjectSource,
  type SummaryLocale,
} from "./prompt.ts"

/**
 * Shown next to the summary wherever it is rendered. A constant, never model
 * output: the notice must not depend on what the model decided to return.
 */
export const DISCLOSURE: Readonly<Record<SummaryLocale, string>> = {
  en: "Content generated with AI",
  fi: "Tekoälyllä tuotettu sisältö",
  "pt-br": "Conteúdo gerado com IA",
}

const CONTENT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
)

export type SummaryRecord = {
  slug: string
  locale: SummaryLocale
  summary: string
  generatedWithAi: true
  disclosure: string
  model: string
  promptVersion: number
  generatedAt: string
  sourceHash: string
}

export function summaryPath(slug: string, locale: SummaryLocale): string {
  return path.join(CONTENT_ROOT, "projects", slug, `ai-summary.${locale}.json`)
}

export function summaryExists(slug: string, locale: SummaryLocale): boolean {
  return existsSync(summaryPath(slug, locale))
}

/** Records which source text produced this summary, so phase 2 can spot drift. */
export function sourceHash(source: ProjectSource): string {
  const canonical = JSON.stringify([
    source.title,
    source.description ?? null,
    source.highlight ?? null,
    source.problem ?? null,
    source.outcome ?? null,
  ])

  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`
}

export function buildRecord({
  slug,
  locale,
  summary,
  model,
  source,
}: {
  slug: string
  locale: SummaryLocale
  summary: string
  model: string
  source: ProjectSource
}): SummaryRecord {
  return {
    slug,
    locale,
    summary,
    generatedWithAi: true,
    disclosure: DISCLOSURE[locale],
    model,
    promptVersion: PROMPT_VERSION,
    generatedAt: new Date().toISOString(),
    sourceHash: sourceHash(source),
  }
}

export async function writeSummary(record: SummaryRecord): Promise<string> {
  const target = summaryPath(record.slug, record.locale)
  await writeFile(target, `${JSON.stringify(record, null, 2)}\n`, "utf8")
  return target
}
