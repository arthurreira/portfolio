import type { ModelMessage } from "ai"

/**
 * Streams text from a Workers AI model.
 *
 * This talks to the binding directly rather than going through
 * `workers-ai-provider`. That package looks like the natural choice, but at
 * 4.0.0 its streaming path reads both `chunk.response` (Workers AI's native
 * field) and `chunk.choices[0].delta.content` (the OpenAI-compatible one) and
 * emits a text delta for each. Most models return both, so every token arrives
 * twice — "ArthurArthur works as a works as a Junior Software Engineer".
 *
 * Deduplicating that downstream is not safe: the duplicates are byte-identical
 * and adjacent, and so is a model legitimately emitting `"\n"` twice, so a
 * filter that collapses them would quietly eat paragraph breaks. Reading one
 * field ourselves is less code than working around the bug.
 */

interface WorkersAiChunk {
  response?: string
}

/** Flattens an AI SDK message to the plain string Workers AI expects. */
const toPlainText = (content: ModelMessage["content"]): string => {
  if (typeof content === "string") return content

  return content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
}

export interface WorkersAiStreamParams {
  ai: Ai
  model: string
  system: string
  messages: ModelMessage[]
  maxOutputTokens: number
  /**
   * Repeated after the visitor's message, where a small model weights it most.
   */
  reminder?: string
}

/** Yields text deltas as the model produces them. */
export async function* streamWorkersAiText({
  ai,
  model,
  system,
  messages,
  maxOutputTokens,
  reminder,
}: WorkersAiStreamParams): AsyncGenerator<string> {
  const result = await ai.run(
    model as Parameters<Ai["run"]>[0],
    {
      stream: true,
      max_tokens: maxOutputTokens,
      messages: [
        { role: "system", content: system },
        ...messages.map((message) => ({
          role: message.role,
          content: toPlainText(message.content),
        })),
        // Last position, after the question.
        ...(reminder ? [{ role: "system", content: reminder }] : []),
      ],
    } as never
  )

  const body = result as unknown as ReadableStream<Uint8Array>
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split("\n")
      // The last element is whatever came after the final newline — possibly a
      // partial line, so it stays in the buffer until the rest arrives.
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith("data:")) continue

        const payload = trimmed.slice(5).trim()
        if (!payload || payload === "[DONE]") continue

        let chunk: WorkersAiChunk
        try {
          chunk = JSON.parse(payload) as WorkersAiChunk
        } catch {
          // A malformed chunk should cost one token, not the whole answer.
          console.error("workers ai: unparseable chunk")
          continue
        }

        if (chunk.response) yield chunk.response
      }
    }
  } finally {
    await reader.cancel().catch(() => {})
  }
}
