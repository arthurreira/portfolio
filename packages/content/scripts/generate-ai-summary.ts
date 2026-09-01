import Anthropic from "@anthropic-ai/sdk"
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema"

import { projects } from "../.velite/index.js"
import {
  buildRecord,
  summaryExists,
  summaryPath,
  writeSummary,
} from "./ai-summary/files.ts"
import {
  SUMMARY_LOCALES,
  SYSTEM_PROMPT,
  buildUserMessage,
  summaryJsonSchema,
  type ProjectSource,
  type SummaryLocale,
} from "./ai-summary/prompt.ts"

const MODEL = "claude-opus-5"
const MAX_TOKENS = 4000
const SENTENCE_CEILING = 2
const WORD_CEILING = 40

function fail(message: string): never {
  console.error(`error: ${message}`)
  process.exit(1)
}

function readSlug(argv: readonly string[]): string {
  const index = argv.indexOf("--slug")
  const slug = index === -1 ? undefined : argv[index + 1]

  if (!slug) {
    fail("missing --slug. Usage: ai:summary -- --slug <project-slug>")
  }

  return slug
}

/** Every locale must exist, since one call produces all three at once. */
function collectSources(slug: string): Record<SummaryLocale, ProjectSource> {
  const entries = SUMMARY_LOCALES.map((locale) => {
    const project = projects.find(
      (item) => item.slug === slug && item.locale === locale
    )

    if (!project) fail(`no ${locale} content for project "${slug}"`)

    return [
      locale,
      {
        title: project.title,
        description: project.description,
        highlight: project.highlight,
        problem: project.problem,
        outcome: project.outcome,
      },
    ] as const
  })

  return Object.fromEntries(entries) as Record<SummaryLocale, ProjectSource>
}

function countSentences(text: string): number {
  return text.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function reportCeilings(locale: SummaryLocale, summary: string): void {
  const sentences = countSentences(summary)
  const words = countWords(summary)

  if (sentences > SENTENCE_CEILING || words > WORD_CEILING) {
    console.warn(
      `  warning: ${locale} is ${sentences} sentences / ${words} words ` +
        `(ceiling ${SENTENCE_CEILING} / ${WORD_CEILING})`
    )
  }
}

function describeApiError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return "ANTHROPIC_API_KEY was rejected. Check the key in apps/web/.env.local."
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "rate limited by the API. Nothing was written; run it again later."
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return "could not reach the API (network or timeout). Nothing was written."
  }
  if (error instanceof Anthropic.APIError) {
    return `API error ${error.status}: ${error.message}`
  }
  return error instanceof Error ? error.message : String(error)
}

async function generate(
  sources: Record<SummaryLocale, ProjectSource>
): Promise<Record<SummaryLocale, string>> {
  const client = new Anthropic()

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(sources) }],
    output_config: {
      effort: "low",
      format: jsonSchemaOutputFormat(summaryJsonSchema),
    },
  })

  if (response.stop_reason === "refusal") {
    fail(`the model declined this request (${response.stop_details?.category})`)
  }

  const parsed = response.parsed_output
  if (!parsed) fail("the API returned no parsable summary. Nothing written.")

  for (const locale of SUMMARY_LOCALES) {
    if (!parsed[locale]?.trim()) fail(`the API returned an empty ${locale}`)
  }

  const usage = response.usage
  console.log(
    `tokens: ${usage.input_tokens} in / ${usage.output_tokens} out ` +
      `(model ${response.model})`
  )

  return parsed
}

async function main(): Promise<void> {
  const slug = readSlug(process.argv.slice(2))
  const sources = collectSources(slug)

  const missing = SUMMARY_LOCALES.filter(
    (locale) => !summaryExists(slug, locale)
  )

  if (missing.length === 0) {
    console.log(
      `Nothing to do: all ${SUMMARY_LOCALES.length} summaries already exist ` +
        `for "${slug}". Delete the file you want regenerated and run again:`
    )
    for (const locale of SUMMARY_LOCALES) {
      console.log(`  ${summaryPath(slug, locale)}`)
    }
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    fail(
      "ANTHROPIC_API_KEY is not set. The script reads apps/web/.env.local — " +
        "run it through the ai:summary package script."
    )
  }

  console.log(`Generating ${missing.join(", ")} for "${slug}"...`)

  let summaries: Record<SummaryLocale, string>
  try {
    summaries = await generate(sources)
  } catch (error) {
    fail(describeApiError(error))
  }

  // Only the missing locales are written; existing files are never touched,
  // even though one call produced all three.
  for (const locale of missing) {
    const summary = summaries[locale].trim()
    reportCeilings(locale, summary)
    const target = await writeSummary(
      buildRecord({
        slug,
        locale,
        summary,
        model: MODEL,
        source: sources[locale],
      })
    )
    console.log(`  wrote ${target}`)
  }
}

await main()
