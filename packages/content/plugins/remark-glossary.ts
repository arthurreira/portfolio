import type { Root, Text } from "mdast"
import type { MdxJsxTextElement } from "mdast-util-mdx-jsx"
import type { Node, Parent } from "unist"
import type { Plugin } from "unified"
import { CONTINUE, SKIP, visit } from "unist-util-visit"

import type { Glossary, Locale } from "../glossary"

type GlossaryFile = { path?: string }

export type GlossaryLocaleResolver = (file: GlossaryFile) => Locale

export type RemarkGlossaryOptions = {
  glossary: Glossary
  locale: Locale | GlossaryLocaleResolver
}

type MatchCandidate = {
  id: string
  term: string
}

const PROTECTED_NODE_TYPES = new Set([
  "code",
  "inlineCode",
  "link",
  "linkReference",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
])

const WORD_CHARACTER = /[\p{L}\p{N}_]/u

function codePointLengthAt(value: string, index: number): number {
  // Caller guarantees index < value.length, so a code point always exists.
  return String.fromCodePoint(value.codePointAt(index)!).length
}

function characterBefore(value: string, index: number): string | undefined {
  return Array.from(value.slice(0, index)).at(-1)
}

function characterAfter(
  value: string,
  index: number,
  term: string
): string | undefined {
  return Array.from(value.slice(index + term.length))[0]
}

function hasWholeTokenBoundaries(
  value: string,
  index: number,
  term: string
): boolean {
  const before = characterBefore(value, index)
  const after = characterAfter(value, index, term)

  return (
    (!before || !WORD_CHARACTER.test(before)) &&
    (!after || !WORD_CHARACTER.test(after))
  )
}

function glossaryNode({ id, term }: MatchCandidate): MdxJsxTextElement {
  return {
    type: "mdxJsxTextElement",
    name: "GlossaryTerm",
    attributes: [
      { type: "mdxJsxAttribute", name: "id", value: id },
      { type: "mdxJsxAttribute", name: "term", value: term },
    ],
    children: [],
  }
}

function textNode(value: string): Text {
  return { type: "text", value }
}

function splitTextNode(
  node: Text,
  candidates: readonly MatchCandidate[],
  seen: Set<string>
): Node[] | undefined {
  const replacements: Node[] = []
  let plainStart = 0
  let index = 0
  let didWrap = false

  while (index < node.value.length) {
    const candidate = candidates.find(
      ({ term }) =>
        node.value.startsWith(term, index) &&
        hasWholeTokenBoundaries(node.value, index, term)
    )

    if (!candidate) {
      index += codePointLengthAt(node.value, index)
      continue
    }

    if (seen.has(candidate.id)) {
      index += candidate.term.length
      continue
    }

    if (plainStart < index) {
      replacements.push(textNode(node.value.slice(plainStart, index)))
    }

    replacements.push(glossaryNode(candidate))
    seen.add(candidate.id)
    didWrap = true
    index += candidate.term.length
    plainStart = index
  }

  if (!didWrap) return undefined

  if (plainStart < node.value.length) {
    replacements.push(textNode(node.value.slice(plainStart)))
  }

  return replacements
}

/** Marks the first eligible prose occurrence of each glossary concept. */
export const remarkGlossary: Plugin<[RemarkGlossaryOptions], Root> =
  ({ glossary, locale: localeOption }) =>
  (tree, file) => {
    const locale =
      typeof localeOption === "function" ? localeOption(file) : localeOption
    const candidates = Object.entries(glossary)
      .flatMap(([id, entry]) =>
        (entry.match[locale] ?? []).map((term) => ({ id, term }))
      )
      .filter(({ term }) => term.length > 0)
      .sort((left, right) => right.term.length - left.term.length)
    const seen = new Set<string>()

    visit(tree, (node, index, parent) => {
      if (PROTECTED_NODE_TYPES.has(node.type)) return SKIP
      if (node.type !== "text" || index === undefined || !parent) {
        return CONTINUE
      }

      const replacements = splitTextNode(node, candidates, seen)
      if (!replacements) return CONTINUE
      ;(parent as Parent).children.splice(index, 1, ...replacements)
      return [SKIP, index + replacements.length]
    })
  }
