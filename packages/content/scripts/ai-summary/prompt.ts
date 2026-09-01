/** Bump when the prompt text below changes. Recorded in every output file. */
export const PROMPT_VERSION = 2

export const SUMMARY_LOCALES = ["en", "fi", "pt-br"] as const

export type SummaryLocale = (typeof SUMMARY_LOCALES)[number]

/** One call returns all three, so the schema is the whole response. */
export const summaryJsonSchema = {
  type: "object",
  properties: {
    en: { type: "string" },
    fi: { type: "string" },
    "pt-br": { type: "string" },
  },
  required: ["en", "fi", "pt-br"],
  additionalProperties: false,
} as const

export type ProjectSource = {
  title: string
  description?: string
  highlight?: string
  problem?: string
  outcome?: string
}

export const SYSTEM_PROMPT = `You write short factual summaries of software projects for a personal engineering portfolio.

You produce the summary in three languages in a single response: English, Finnish (suomi), and Brazilian Portuguese (português do Brasil).

Write each language natively. Base each summary on the hand-written text for that same language in the project data below. Each version must read as if written by someone thinking in that language, with idiomatic word choice and natural sentence structure. Do not write one summary and translate it — the three may differ in phrasing and emphasis, as long as each stays true to the project data.

Rules, for every language:
- At most 2 sentences. At most 40 words. These are ceilings, not targets.
- Use only the facts in the project data. Do not add technologies, numbers, dates, users, companies, or results that are not there.
- Do not list technologies, frameworks, or services. This is prose about what the project does and why, not a stack list.
- If a field is absent, write around it. Never mention that information is missing.
- Plain prose only: no markdown, no lists, no headings, no surrounding quotes.
- Do not open with the project name, and do not use filler openers such as "This project" / "Tämä projekti" / "Este projeto".
- Concrete technical register. No marketing language, no superlatives, no exclamation marks.
- The summary sits next to a hand-written description the reader has already seen. Do not paraphrase that description sentence by sentence; say what the project does and why it exists in your own construction.`

const FIELD_LABELS: ReadonlyArray<[keyof ProjectSource, string]> = [
  ["title", "Title"],
  ["description", "Description"],
  ["highlight", "Highlight"],
  ["problem", "Problem"],
  ["outcome", "Outcome"],
]

/** Absent fields are omitted entirely rather than sent as empty strings. */
function sourceBlock(locale: SummaryLocale, source: ProjectSource): string {
  const lines = FIELD_LABELS.flatMap(([field, label]) => {
    const value = source[field]
    return value ? [`${label}: ${value}`] : []
  })

  return [`[${locale}]`, ...lines].join("\n")
}

export function buildUserMessage(
  sources: Readonly<Record<SummaryLocale, ProjectSource>>
): string {
  const blocks = SUMMARY_LOCALES.map((locale) =>
    sourceBlock(locale, sources[locale])
  )

  return [
    "Project data. Each block holds the hand-written text for that locale.",
    "",
    blocks.join("\n\n"),
  ].join("\n")
}
