import type { TextStreamPart, ToolSet } from "ai"
import { describe, expect, it, vi } from "vitest"

import { probeStream } from "./probe-stream"

type Part = TextStreamPart<ToolSet>

const part = (type: string, extra: Record<string, unknown> = {}) =>
  ({ type, ...extra }) as unknown as Part

const streamOf = (parts: Part[]) =>
  new ReadableStream<Part>({
    start(controller) {
      for (const value of parts) controller.enqueue(value)
      controller.close()
    },
  })

const drain = async (stream: ReadableStream<Part>) => {
  const collected: Part[] = []
  const reader = stream.getReader()
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    collected.push(value)
  }
  return collected
}

describe("probeStream failure detection", () => {
  // streamText resolves even when the upstream rejects, surfacing the failure
  // as an error part. Without the probe the Response is already returned.
  it("reports an error part as a failure", async () => {
    const result = await probeStream(
      streamOf([part("start"), part("error", { error: new Error("upstream") })])
    )

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(Error)
  })

  it("reports a rejected read as a failure", async () => {
    const stream = new ReadableStream<Part>({
      start(controller) {
        controller.error(new Error("socket died"))
      },
    })

    const result = await probeStream(stream)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBeInstanceOf(Error)
  })

  it("cancels the source once it has failed", async () => {
    const cancel = vi.fn()
    const stream = new ReadableStream<Part>({
      start(controller) {
        controller.enqueue(part("error", { error: "boom" }))
      },
      cancel,
    })

    const result = await probeStream(stream)

    expect(result.ok).toBe(false)
    expect(cancel).toHaveBeenCalledOnce()
  })
})

describe("probeStream success detection", () => {
  it.each([
    "text-start",
    "text-delta",
    "reasoning-start",
    "reasoning-delta",
    "tool-input-start",
    "tool-call",
    "source",
    "file",
  ])("treats %s as the model having started answering", async (type) => {
    const result = await probeStream(streamOf([part(type)]))

    expect(result.ok).toBe(true)
  })

  it("keeps waiting through non-content parts", async () => {
    const result = await probeStream(
      streamOf([
        part("start"),
        part("start-step"),
        part("error", { error: "late failure" }),
      ])
    )

    expect(result.ok).toBe(false)
  })

  it("succeeds when the stream ends with no content and no error", async () => {
    const result = await probeStream(streamOf([part("start"), part("finish")]))

    expect(result.ok).toBe(true)
  })
})

describe("probeStream replay", () => {
  // The probe consumes parts to make its decision; the caller must still see
  // every one of them, in order.
  it("loses nothing it consumed while probing", async () => {
    const source = streamOf([
      part("start"),
      part("start-step"),
      part("text-start"),
      part("text-delta", { text: "Arthur" }),
      part("finish"),
    ])

    const result = await probeStream(source)

    expect(result.ok).toBe(true)
    if (!result.ok) return

    const parts = await drain(result.stream)
    expect(parts.map((value) => value.type)).toEqual([
      "start",
      "start-step",
      "text-start",
      "text-delta",
      "finish",
    ])
  })

  it("replays a stream that ended during the probe", async () => {
    const result = await probeStream(streamOf([part("start"), part("finish")]))

    expect(result.ok).toBe(true)
    if (!result.ok) return

    const parts = await drain(result.stream)
    expect(parts.map((value) => value.type)).toEqual(["start", "finish"])
  })

  it("propagates cancellation to the source", async () => {
    const cancel = vi.fn()
    const source = new ReadableStream<Part>({
      start(controller) {
        controller.enqueue(part("text-start"))
      },
      cancel,
    })

    const result = await probeStream(source)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    await result.stream.cancel("caller went away")

    expect(cancel).toHaveBeenCalledWith("caller went away")
  })
})
