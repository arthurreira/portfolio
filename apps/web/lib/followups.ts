const OPEN = "<followups>"
const CLOSE = "</followups>"

export interface SplitAnswer {
  /** The reply as it should be shown — never contains the marker block. */
  answer: string
  /** Suggested next questions, empty until the block has fully streamed in. */
  followups: string[]
}

/** Separates the assistant's answer from the follow-up block it appends. */
export function splitFollowups(text: string): SplitAnswer {
  const start = text.indexOf(OPEN)

  if (start === -1) {
    // No complete tag yet. If the tail looks like the start of one, hide it.
    const caret = text.lastIndexOf("<")
    const isPartialTag = caret !== -1 && OPEN.startsWith(text.slice(caret))
    return {
      answer: isPartialTag ? text.slice(0, caret).trimEnd() : text,
      followups: [],
    }
  }

  const answer = text.slice(0, start).trimEnd()
  const end = text.indexOf(CLOSE, start)

  // Still streaming the block — show the answer, hold the buttons back.
  if (end === -1) return { answer, followups: [] }

  const followups = text
    .slice(start + OPEN.length, end)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return { answer, followups }
}
