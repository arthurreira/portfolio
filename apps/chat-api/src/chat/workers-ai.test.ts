import type { ModelMessage } from "ai"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { callArg } from "../test-support/mock-calls"
import { streamWorkersAiText } from "./workers-ai"

interface WorkersAiBody {
  stream: boolean
  max_tokens: number
  messages: { role: string; content: string }[]
}

/** Builds the SSE byte stream the Workers AI binding returns. */
const sseStream = (lines: string[]) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      for (const line of lines) controller.enqueue(encoder.encode(line))
      controller.close()
    },
  })

const data = (payload: Record<string, unknown>) =>
  `data: ${JSON.stringify(payload)}\n`

const fakeAi = (stream: ReadableStream<Uint8Array>) => {
  const run = vi.fn().mockResolvedValue(stream)
  return { ai: { run } as unknown as Ai, run }
}

const collect = async (generator: AsyncGenerator<string>) => {
  const chunks: string[] = []
  for await (const chunk of generator) chunks.push(chunk)
  return chunks
}

const params = (ai: Ai, extra: Record<string, unknown> = {}) => ({
  ai,
  model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  system: "You answer questions about Arthur.",
  messages: [{ role: "user", content: "Who is Arthur?" }] as ModelMessage[],
  maxOutputTokens: 512,
  ...extra,
})

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("streamWorkersAiText token emission", () => {
  it("yields each delta once", async () => {
    const { ai } = fakeAi(
      sseStream([data({ response: "Arthur" }), data({ response: " works" })])
    )

    expect(await collect(streamWorkersAiText(params(ai)))).toEqual([
      "Arthur",
      " works",
    ])
  })

  // workers-ai-provider@4.0.0 reads both `response` and
  // `choices[0].delta.content` and emits a delta for each, so every token
  // arrives twice. Reading one field is the entire reason this module exists.
  it("ignores the OpenAI-compatible field so tokens are not doubled", async () => {
    const { ai } = fakeAi(
      sseStream([
        data({
          response: "Arthur",
          choices: [{ delta: { content: "Arthur" } }],
        }),
        data({
          response: " works",
          choices: [{ delta: { content: " works" } }],
        }),
      ])
    )

    expect(await collect(streamWorkersAiText(params(ai)))).toEqual([
      "Arthur",
      " works",
    ])
  })

  // Duplicates would be indistinguishable from this, which is why they cannot
  // be filtered downstream.
  it("preserves a repeated newline the model meant to send", async () => {
    const { ai } = fakeAi(
      sseStream([data({ response: "\n" }), data({ response: "\n" })])
    )

    expect(await collect(streamWorkersAiText(params(ai)))).toEqual(["\n", "\n"])
  })

  it("skips chunks carrying no response text", async () => {
    const { ai } = fakeAi(
      sseStream([
        data({ response: "" }),
        data({ usage: { prompt_tokens: 4 } }),
        data({ response: "hei" }),
      ])
    )

    expect(await collect(streamWorkersAiText(params(ai)))).toEqual(["hei"])
  })
})

describe("streamWorkersAiText SSE parsing", () => {
  it("reassembles a chunk split across reads", async () => {
    const payload = data({ response: "Arthur" })
    const { ai } = fakeAi(
      sseStream([
        payload.slice(0, 9),
        payload.slice(9),
        data({ response: "!" }),
      ])
    )

    expect(await collect(streamWorkersAiText(params(ai)))).toEqual([
      "Arthur",
      "!",
    ])
  })

  it.each([
    ["the terminator", "data: [DONE]\n"],
    ["an empty payload", "data:\n"],
    ["a blank line", "\n"],
    ["a non-data line", "event: message\n"],
  ])("skips %s", async (_label, line) => {
    const { ai } = fakeAi(sseStream([line, data({ response: "hei" })]))

    expect(await collect(streamWorkersAiText(params(ai)))).toEqual(["hei"])
  })

  it("drops an unparseable chunk instead of the whole answer", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const { ai } = fakeAi(
      sseStream([
        data({ response: "before" }),
        "data: {not json}\n",
        data({ response: "after" }),
      ])
    )

    expect(await collect(streamWorkersAiText(params(ai)))).toEqual([
      "before",
      "after",
    ])
    expect(error).toHaveBeenCalled()
  })
})

describe("streamWorkersAiText request shape", () => {
  it("puts the system prompt first and passes the token cap", async () => {
    const { ai, run } = fakeAi(sseStream([data({ response: "hei" })]))

    await collect(streamWorkersAiText(params(ai)))

    const body = callArg<WorkersAiBody>(run, 1)
    expect(callArg<string>(run, 0)).toBe(
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
    )
    expect(body.stream).toBe(true)
    expect(body.max_tokens).toBe(512)
    expect(body.messages[0]).toEqual({
      role: "system",
      content: "You answer questions about Arthur.",
    })
  })

  // A small model weights the reminder most when it sits after the question.
  it("appends the reminder after the visitor's message", async () => {
    const { ai, run } = fakeAi(sseStream([data({ response: "hei" })]))

    await collect(
      streamWorkersAiText(params(ai, { reminder: "Answer in Finnish." }))
    )

    const body = callArg<WorkersAiBody>(run, 1)
    expect(body.messages.at(-1)).toEqual({
      role: "system",
      content: "Answer in Finnish.",
    })
  })

  it("omits the reminder when there is none", async () => {
    const { ai, run } = fakeAi(sseStream([data({ response: "hei" })]))

    await collect(streamWorkersAiText(params(ai)))

    const body = callArg<WorkersAiBody>(run, 1)
    expect(body.messages).toHaveLength(2)
    expect(body.messages.at(-1)?.role).toBe("user")
  })

  it("flattens structured content to plain text", async () => {
    const { ai, run } = fakeAi(sseStream([data({ response: "hei" })]))

    await collect(
      streamWorkersAiText(
        params(ai, {
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Who is " },
                { type: "text", text: "Arthur?" },
              ],
            },
          ] as ModelMessage[],
        })
      )
    )

    const body = callArg<WorkersAiBody>(run, 1)
    expect(body.messages[1]).toEqual({
      role: "user",
      content: "Who is Arthur?",
    })
  })
})

describe("streamWorkersAiText cancellation", () => {
  it("yields nothing when the visitor is already gone", async () => {
    const { ai } = fakeAi(sseStream([data({ response: "Arthur" })]))
    const controller = new AbortController()
    controller.abort()

    const chunks = await collect(
      streamWorkersAiText(params(ai, { signal: controller.signal }))
    )

    expect(chunks).toEqual([])
  })

  it("stops pulling once the visitor leaves mid-answer", async () => {
    const { ai } = fakeAi(
      sseStream([data({ response: "Arthur" }), data({ response: " works" })])
    )
    const controller = new AbortController()
    const seen: string[] = []

    for await (const chunk of streamWorkersAiText(
      params(ai, { signal: controller.signal })
    )) {
      seen.push(chunk)
      controller.abort()
    }

    expect(seen).toEqual(["Arthur"])
  })
})
