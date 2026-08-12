import type { TextStreamPart, ToolSet, UIMessage } from "ai"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { ChatConfig } from "../config"
import { DEGRADED_HEADER } from "../http/headers"
import { callArg } from "../test-support/mock-calls"
import { streamChat } from "./chat"

interface StreamTextArgs {
  model: { modelId: string }
  instructions: {
    content: string
    providerOptions: { anthropic: { cacheControl: { type: string } } }
  }
  messages: { role: string; content: { type: string; text: string }[] }[]
  maxOutputTokens: number
}

interface WorkersAiArgs {
  model: string
  system: string
  maxOutputTokens: number
  reminder?: string
}

const streamTextArgs = () => callArg<StreamTextArgs>(streamText)
const workersAiArgs = () => callArg<WorkersAiArgs>(streamWorkersAiText)

const streamText = vi.hoisted(() => vi.fn())
const streamWorkersAiText = vi.hoisted(() => vi.fn())

vi.mock("@ai-sdk/anthropic", () => ({
  createAnthropic: () => (model: string) => ({ modelId: model }),
}))

vi.mock("ai", async (importOriginal) => ({
  ...(await importOriginal<typeof import("ai")>()),
  streamText,
}))

vi.mock("./workers-ai", () => ({ streamWorkersAiText }))

type Part = TextStreamPart<ToolSet>

const part = (type: string, extra: Record<string, unknown> = {}) =>
  ({ type, ...extra }) as unknown as Part

const primaryStream = (parts: Part[]) => ({
  stream: new ReadableStream<Part>({
    start(controller) {
      for (const value of parts) controller.enqueue(value)
      controller.close()
    },
  }),
})

async function* deltas(...values: string[]) {
  for (const value of values) yield value
}

const config: ChatConfig = {
  model: "claude-haiku-4-5",
  fallbackModel: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  maxOutputTokens: 1024,
  maxHistoryMessages: 20,
}

const message = (text: string, id = text): UIMessage =>
  ({ id, role: "user", parts: [{ type: "text", text }] }) as UIMessage

const fakeAi = {} as Ai

const params = (extra: Record<string, unknown> = {}) => ({
  apiKey: "sk-test",
  config,
  systemPrompt: "SYSTEM",
  fallbackSystemPrompt: "HARDENED SYSTEM",
  messages: [message("Who is Arthur?")],
  model: "claude" as const,
  ...extra,
})

const bodyOf = async (response: Response) => await response.text()

beforeEach(() => {
  streamText.mockReturnValue(primaryStream([part("text-start")]))
  streamWorkersAiText.mockImplementation(() => deltas("hei"))
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe("streamChat cost controls", () => {
  // History length drives input cost on every single request.
  it("keeps only the most recent turns", async () => {
    await streamChat(
      params({
        messages: Array.from({ length: 50 }, (_, i) => message(`m${i}`)),
        config: { ...config, maxHistoryMessages: 5 },
      })
    )

    const { messages } = streamTextArgs()
    expect(messages).toHaveLength(5)
    expect(messages.at(-1)?.content[0]?.text).toBe("m49")
    expect(messages[0]?.content[0]?.text).toBe("m45")
  })

  it("passes a short history through untouched", async () => {
    await streamChat(params({ messages: [message("a"), message("b")] }))

    expect(streamTextArgs().messages).toHaveLength(2)
  })

  it("passes the output-token cap to the model", async () => {
    await streamChat(params())

    expect(streamTextArgs().maxOutputTokens).toBe(1024)
  })

  // ~5k tokens of identical portfolio content per locale on every request.
  it("marks the system prompt cacheable", async () => {
    await streamChat(params())

    const { instructions } = streamTextArgs()
    expect(instructions.content).toBe("SYSTEM")
    expect(instructions.providerOptions.anthropic.cacheControl).toEqual({
      type: "ephemeral",
    })
  })
})

describe("streamChat primary path", () => {
  it("streams the primary model when it answers", async () => {
    const response = await streamChat(params({ ai: fakeAi }))

    expect(response.headers.get(DEGRADED_HEADER)).toBeNull()
    expect(streamWorkersAiText).not.toHaveBeenCalled()
  })

  it("forwards CORS headers onto the stream", async () => {
    const response = await streamChat(
      params({ headers: { "access-control-allow-origin": "https://a.dev" } })
    )

    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://a.dev"
    )
  })

  it("uses the configured model id", async () => {
    await streamChat(
      params({ config: { ...config, model: "claude-sonnet-5" } })
    )

    expect(streamTextArgs().model.modelId).toBe("claude-sonnet-5")
  })
})

describe("streamChat fallback on failure", () => {
  // streamText resolves even when the upstream rejects; the failure arrives as
  // an error part, which is why the probe has to run before responding.
  it("retries on Workers AI when the primary fails", async () => {
    streamText.mockReturnValue(
      primaryStream([part("error", { error: new Error("overloaded") })])
    )

    const response = await streamChat(params({ ai: fakeAi }))

    expect(streamWorkersAiText).toHaveBeenCalledOnce()
    expect(await bodyOf(response)).toContain("hei")
  })

  it("tells the client the answer came from the backup", async () => {
    streamText.mockReturnValue(
      primaryStream([part("error", { error: "overloaded" })])
    )

    const response = await streamChat(params({ ai: fakeAi }))

    expect(response.headers.get(DEGRADED_HEADER)).toBe("true")
  })

  it("hardens the prompt for the smaller model", async () => {
    streamText.mockReturnValue(
      primaryStream([part("error", { error: "overloaded" })])
    )

    await streamChat(params({ ai: fakeAi }))

    const args = workersAiArgs()
    expect(args.system).toBe("HARDENED SYSTEM")
    expect(args.model).toBe("@cf/meta/llama-3.3-70b-instruct-fp8-fast")
    expect(args.reminder).toBeTruthy()
  })

  it("keeps the cost ceiling on the fallback too", async () => {
    streamText.mockReturnValue(
      primaryStream([part("error", { error: "overloaded" })])
    )

    await streamChat(
      params({ ai: fakeAi, config: { ...config, maxOutputTokens: 256 } })
    )

    expect(workersAiArgs().maxOutputTokens).toBe(256)
  })

  // With nothing to fall back to, the original failure is the real answer.
  it("surfaces the primary failure when no binding is configured", async () => {
    streamText.mockReturnValue(
      primaryStream([part("error", { error: "overloaded" })])
    )

    const response = await streamChat(params())

    expect(streamWorkersAiText).not.toHaveBeenCalled()
    expect(response.headers.get(DEGRADED_HEADER)).toBeNull()
  })
})

describe("streamChat visitor model choice", () => {
  it("streams Workers AI directly when the visitor picks it", async () => {
    const response = await streamChat(
      params({ model: "workers-ai", ai: fakeAi })
    )

    expect(streamText).not.toHaveBeenCalled()
    expect(streamWorkersAiText).toHaveBeenCalledOnce()
    expect(await bodyOf(response)).toContain("hei")
  })

  // A deliberate choice is not a degraded answer.
  it("does not mark a deliberate choice as degraded", async () => {
    const response = await streamChat(
      params({ model: "workers-ai", ai: fakeAi })
    )

    expect(response.headers.get(DEGRADED_HEADER)).toBeNull()
  })

  it("falls back to Anthropic when the binding is missing", async () => {
    await streamChat(params({ model: "workers-ai" }))

    expect(streamText).toHaveBeenCalledOnce()
    expect(streamWorkersAiText).not.toHaveBeenCalled()
  })
})
