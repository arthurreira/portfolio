import { createAnthropic } from "@ai-sdk/anthropic"
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type ModelMessage,
  type TextStreamPart,
  type ToolSet,
  type UIMessage,
} from "ai"

import type { ChatConfig } from "./config"
import type { ModelChoice } from "./validation"
import { DEGRADED_HEADER } from "./headers"
import { probeStream } from "./probe-stream"
import { FALLBACK_REMINDER } from "./portfolio-context"
import { streamWorkersAiText } from "./workers-ai"

interface StreamChatParams {
  apiKey: string
  config: ChatConfig
  systemPrompt: string
  /** Same prompt hardened for the smaller model — see buildFallbackSystemPrompt. */
  fallbackSystemPrompt: string
  messages: UIMessage[]
  headers?: Record<string, string>
  /** Workers AI binding. Absent locally unless `wrangler dev --remote`. */
  ai?: Ai
  /** Validated visitor choice; "workers-ai" streams the free model directly. */
  model: ModelChoice
}

const toResponse = <TOOLS extends ToolSet>(
  stream: ReadableStream<TextStreamPart<TOOLS>>,
  headers?: Record<string, string>
): Response =>
  createUIMessageStreamResponse({
    headers,
    stream: toUIMessageStream({
      stream,
      onError: (error) => {
        // Logged to Workers observability; the client gets a generic message.
        console.error("chat stream failed", error)
        return "upstream_failed"
      },
    }),
  })

/**
 * Streams a completion in the AI SDK UI Message Stream format, so the browser
 * can consume it with `useChat` + `DefaultChatTransport` and no custom parsing.
 *
 * Keeping the wire format standard is also what lets the shadcn AI SDK helper
 * stand in for this Worker during UI development.
 *
 * If Anthropic fails, the same request is retried against a Workers AI model and
 * the response is marked degraded. The likeliest reason for that failure is the
 * Anthropic balance running out, and a portfolio whose chat answers a little
 * less well is better than one whose chat is broken in front of a recruiter.
 */
export const streamChat = async ({
  apiKey,
  config,
  systemPrompt,
  messages,
  headers,
  ai,
  model,
  fallbackSystemPrompt,
}: StreamChatParams): Promise<Response> => {
  // Keep only the most recent turns: history length drives input cost, and an
  // unbounded transcript would also eventually exceed the context window.
  const recent = messages.slice(-config.maxHistoryMessages)
  const modelMessages = await convertToModelMessages(recent)

  // The visitor chose the free model. Not marked degraded — that header means
  // the primary failed, and this is a choice working as intended. If the
  // binding is missing the choice quietly becomes the default, same as any
  // other unhonourable value.
  if (model === "workers-ai" && ai) {
    return streamFallback({
      ai,
      config,
      systemPrompt: fallbackSystemPrompt,
      messages: modelMessages,
      headers,
      degraded: false,
    })
  }

  const anthropic = createAnthropic({ apiKey })
  const primary = streamText({
    model: anthropic(config.model),
    // The prompt is ~5k tokens of portfolio content, identical on every request
    // for a locale, so it is marked cacheable — the single biggest lever on both
    // reply latency and input cost here.
    //
    // Passed as `instructions` with a SystemModelMessage rather than a plain
    // string: provider options given to streamText itself attach the cache
    // breakpoint to the last message, which is the visitor's question and so
    // differs every time. That writes a fresh cache entry per request and reads
    // none — measurably worse than no caching at all.
    instructions: {
      role: "system",
      content: systemPrompt,
      providerOptions: {
        anthropic: { cacheControl: { type: "ephemeral" } },
      },
    },
    messages: modelMessages,
    maxOutputTokens: config.maxOutputTokens,
    onFinish: ({ providerMetadata }) => {
      // Caching fails silently: a prompt that drops under the model's minimum
      // simply stops being cached, with no error and no visible symptom beyond
      // a slower, dearer reply. Logged so the regression is findable.
      const usage = providerMetadata?.anthropic
      console.log("chat usage", JSON.stringify(usage))
    },
  })

  const probed = await probeStream(primary.stream)
  if (probed.ok) return toResponse(probed.stream, headers)

  console.error("primary model failed, falling back", probed.error)

  if (!ai) {
    // No binding to fall back to, so the original failure is the real answer.
    console.error("no Workers AI binding configured for fallback")
    return toResponse(primary.stream, headers)
  }

  return streamFallback({
    ai,
    config,
    systemPrompt: fallbackSystemPrompt,
    messages: modelMessages,
    headers,
    degraded: true,
  })
}

interface StreamFallbackParams {
  ai: Ai
  config: ChatConfig
  systemPrompt: string
  messages: ModelMessage[]
  headers?: Record<string, string>
  /** True when this is a failure fallback rather than the visitor's choice. */
  degraded: boolean
}

/**
 * Second attempt, on Cloudflare's own models.
 *
 * Deliberately not probed. There is nothing left to fall back to, so a failure
 * here has to reach the client as an error either way, and probing would only
 * delay it.
 */
const streamFallback = ({
  ai,
  config,
  systemPrompt,
  messages,
  headers,
  degraded,
}: StreamFallbackParams): Response => {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = "fallback"
      writer.write({ type: "text-start", id })

      for await (const delta of streamWorkersAiText({
        ai,
        model: config.fallbackModel,
        system: systemPrompt,
        messages,
        maxOutputTokens: config.maxOutputTokens,
        reminder: FALLBACK_REMINDER,
      })) {
        writer.write({ type: "text-delta", id, delta })
      }

      writer.write({ type: "text-end", id })
    },
    onError: (error) => {
      console.error("fallback stream failed", error)
      return "upstream_failed"
    },
  })

  return createUIMessageStreamResponse({
    headers: degraded ? { ...headers, [DEGRADED_HEADER]: "true" } : headers,
    stream,
  })
}
