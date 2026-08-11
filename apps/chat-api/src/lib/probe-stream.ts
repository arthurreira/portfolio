import type { TextStreamPart, ToolSet } from "ai"

/** Part types that mean the model has genuinely started answering. */
const CONTENT_PARTS: ReadonlySet<string> = new Set([
  "text-start",
  "text-delta",
  "reasoning-start",
  "reasoning-delta",
  "tool-input-start",
  "tool-call",
  "source",
  "file",
])

export type ProbeResult<TOOLS extends ToolSet> =
  | { ok: true; stream: ReadableStream<TextStreamPart<TOOLS>> }
  | { ok: false; error: unknown }

/**
 * Reads a `streamText` stream until it either fails or starts producing an
 * answer, then hands back an equivalent stream with nothing lost.
 */
export const probeStream = async <TOOLS extends ToolSet>(
  source: ReadableStream<TextStreamPart<TOOLS>>
): Promise<ProbeResult<TOOLS>> => {
  const reader = source.getReader()
  const buffered: TextStreamPart<TOOLS>[] = []

  try {
    for (;;) {
      const { done, value } = await reader.read()

      // Ended without producing content and without erroring. Nothing to fall
      // back from — replay whatever arrived and let the caller stream it.
      if (done) break

      buffered.push(value)

      if (value.type === "error") {
        await reader.cancel().catch(() => {})
        return { ok: false, error: value.error }
      }

      if (CONTENT_PARTS.has(value.type)) break
    }
  } catch (error) {
    // A rejected read rather than an error part — same outcome for the caller.
    await reader.cancel().catch(() => {})
    return { ok: false, error }
  }

  const stream = new ReadableStream<TextStreamPart<TOOLS>>({
    async pull(controller) {
      const replayed = buffered.shift()
      if (replayed) {
        controller.enqueue(replayed)
        return
      }

      const { done, value } = await reader.read()
      if (done) {
        controller.close()
        return
      }
      controller.enqueue(value)
    },
    cancel(reason) {
      return reader.cancel(reason)
    },
  })

  return { ok: true, stream }
}
