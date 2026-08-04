import Anthropic from "@anthropic-ai/sdk"

/** Haiku 4.5 — cheapest model, ample for portfolio Q&A. */
const MODEL = "claude-haiku-4-5"

/** Hard ceiling on generated tokens. Answers are meant to be short; this also caps per-request cost. */
const MAX_TOKENS = 1024

/** Wire format for the browser. Provider-agnostic so the fallback provider can reuse it. */
export type ChatStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; error: string }

/** Request-side message shape — narrower than the SDK's, this is our API contract. */
export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface StreamChatParams {
  apiKey: string
  systemPrompt: string
  messages: ChatMessage[]
}

/**
 * Streams a completion as Server-Sent Events.
 *
 * The system prompt carries a `cache_control` breakpoint so the (stable)
 * portfolio context is billed at cache-read rates on repeat requests.
 */
export const streamChat = ({
  apiKey,
  systemPrompt,
  messages,
}: StreamChatParams): ReadableStream<Uint8Array> => {
  const client = new Anthropic({ apiKey })
  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatStreamEvent) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))

      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: messages.map(({ role, content }) => ({ role, content })),
        })

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            send({ type: "delta", text: event.delta.text })
          }
        }

        send({ type: "done" })
      } catch (error) {
        // Logged to Workers observability; the client gets a generic message.
        console.error("chat stream failed", error)
        send({ type: "error", error: "upstream_failed" })
      } finally {
        controller.close()
      }
    },
  })
}
