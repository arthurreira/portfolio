import { createAnthropic } from "@ai-sdk/anthropic"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"

import type { ChatConfig } from "./config"

interface StreamChatParams {
  apiKey: string
  config: ChatConfig
  systemPrompt: string
  messages: UIMessage[]
  headers?: Record<string, string>
}

/**
 * Streams a completion in the AI SDK UI Message Stream format, so the browser
 * can consume it with `useChat` + `DefaultChatTransport` and no custom parsing.
 *
 * Keeping the wire format standard is also what lets the shadcn AI SDK helper
 * stand in for this Worker during UI development.
 */
export const streamChat = async ({
  apiKey,
  config,
  systemPrompt,
  messages,
  headers,
}: StreamChatParams): Promise<Response> => {
  const anthropic = createAnthropic({ apiKey })

  // Keep only the most recent turns: history length drives input cost, and an
  // unbounded transcript would also eventually exceed the context window.
  const recent = messages.slice(-config.maxHistoryMessages)

  const result = streamText({
    model: anthropic(config.model),
    system: systemPrompt,
    messages: await convertToModelMessages(recent),
    maxOutputTokens: config.maxOutputTokens,
  })

  return createUIMessageStreamResponse({
    headers,
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        // Logged to Workers observability; the client gets a generic message.
        console.error("chat stream failed", error)
        return "upstream_failed"
      },
    }),
  })
}
