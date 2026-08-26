import { createAnthropic } from "@ai-sdk/anthropic"
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type LanguageModelUsage,
  type ModelMessage,
  type TextStreamPart,
  type ToolSet,
  type UIMessage,
} from "ai"

import type { ChatConfig } from "../config"
import type { ModelChoice } from "../http/validation"
import { DEGRADED_HEADER } from "../http/headers"
import { probeStream } from "./probe-stream"
import { FALLBACK_REMINDER } from "./portfolio-context"
import { streamWorkersAiText } from "./workers-ai"

interface StreamChatParams {
  apiKey: string
  config: ChatConfig
  systemPrompt: string
  /**
   * Same prompt hardened for the smaller model — see
   * buildFallbackSystemPrompt.
   */
  fallbackSystemPrompt: string
  messages: UIMessage[]
  headers?: Record<string, string>
  /** Workers AI binding. */
  ai?: Ai
  /** Validated visitor choice; "workers-ai" streams the free model directly. */
  model: ModelChoice
  /**
   * The incoming request's signal, so a visitor who leaves mid-answer stops
   * the upstream generation rather than only stopping us reading it.
   */
  signal?: AbortSignal
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
 * Surfaces an upstream failure as a UI message stream.
 *
 * The probed stream cannot be reused here: probing a failure cancels the
 * source, which both locks it and discards what it held, so handing it back
 * would throw rather than report anything.
 */
const toErrorResponse = (
  error: unknown,
  headers?: Record<string, string>
): Response =>
  createUIMessageStreamResponse({
    headers,
    stream: createUIMessageStream({
      execute: () => {
        throw error instanceof Error ? error : new Error(String(error))
      },
      onError: () => "upstream_failed",
    }),
  })

/**
 * Warns when Anthropic prompt caching did nothing.
 *
 * Caching fails silently — drop the system prompt under the model's minimum
 * cacheable length and the provider just ignores `cacheControl`, with no error
 * and no symptom beyond a slower, dearer reply. A cold cache writes without
 * reading, which is normal, so only "neither read nor written" is a fault.
 *
 * Anomaly-only: a per-request log would be noise nobody reads.
 */
export const warnIfPromptCacheInactive = (
  usage: LanguageModelUsage,
  model: string
): void => {
  const { cacheReadTokens, cacheWriteTokens } = usage.inputTokenDetails

  if (cacheReadTokens || cacheWriteTokens) return

  console.warn(
    "prompt cache inactive",
    JSON.stringify({ model, inputTokens: usage.inputTokens })
  )
}

/**
 * Streams a completion in the AI SDK UI Message Stream format, so the browser
 * can consume it with `useChat` + `DefaultChatTransport` and no custom
 * parsing.
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
  signal,
}: StreamChatParams): Promise<Response> => {
  // Keep only the most recent turns: history length drives input cost, and an
  // unbounded transcript would also eventually exceed the context window.
  const recent = messages.slice(-config.maxHistoryMessages)
  const modelMessages = await convertToModelMessages(recent)

  // The visitor chose the free model.
  if (model === "workers-ai" && ai) {
    return streamFallback({
      ai,
      config,
      systemPrompt: fallbackSystemPrompt,
      messages: modelMessages,
      headers,
      degraded: false,
      signal,
    })
  }

  const anthropic = createAnthropic({ apiKey })
  const primary = streamText({
    model: anthropic(config.model),
    // The prompt is ~5k tokens of portfolio content, identical on every request
    // for a locale, so it is marked cacheable — the single biggest lever on both
    // reply latency and input cost here.
    instructions: {
      role: "system",
      content: systemPrompt,
      providerOptions: {
        anthropic: { cacheControl: { type: "ephemeral" } },
      },
    },
    messages: modelMessages,
    maxOutputTokens: config.maxOutputTokens,
    // The whole point: this reaches the provider's fetch, so aborting it closes
    // the connection to Anthropic instead of only abandoning our end of it.
    abortSignal: signal,
    // Runs inside the stream's lifetime, so the Worker is still alive for it.
    onEnd: ({ usage }) => warnIfPromptCacheInactive(usage, config.model),
  })

  const probed = await probeStream(primary.stream)
  if (probed.ok) return toResponse(probed.stream, headers)

  console.error("primary model failed, falling back", probed.error)

  if (!ai) {
    // No binding to fall back to, so the original failure is the real answer.
    console.error("no Workers AI binding configured for fallback")
    return toErrorResponse(probed.error, headers)
  }

  return streamFallback({
    ai,
    config,
    systemPrompt: fallbackSystemPrompt,
    messages: modelMessages,
    headers,
    degraded: true,
    signal,
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
  signal?: AbortSignal
}

/** Second attempt, on Cloudflare's own models. */
const streamFallback = ({
  ai,
  config,
  systemPrompt,
  messages,
  headers,
  degraded,
  signal,
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
        signal,
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
