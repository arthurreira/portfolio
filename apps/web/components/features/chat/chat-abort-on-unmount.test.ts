// @vitest-environment jsdom
import { act, createElement, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

/**
 * Does the in-flight request survive the component that started it?
 *
 * `SiteChat` lives in the `[locale]` root layout, so a language switch changes
 * the router segment key and React destroys it mid-stream. This pins down
 * whether anything aborts the request when that happens.
 */

type Captured = { signal: AbortSignal | null }

/** A reply that starts and then never finishes, so the unmount lands mid-stream. */
const neverEndingFetch = (captured: Captured) =>
  (async (_input: unknown, init?: { signal?: AbortSignal }) => {
    captured.signal = init?.signal ?? null
    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const part of [
          { type: "start" },
          { type: "start-step" },
          { type: "text-start", id: "0" },
          { type: "text-delta", id: "0", delta: "a long answer, still going" },
        ]) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(part)}\n\n`)
          )
        }
        // Deliberately never closed.
      },
    })
    return new Response(body, {
      status: 200,
      headers: { "content-type": "text/event-stream" },
    })
  }) as unknown as typeof fetch

type ChatApi = ReturnType<typeof useChat>

let api: ChatApi | null = null
/** Proves React actually ran the unmount, rather than the test only claiming so. */
let cleanupRan = false

function Harness({
  transport,
}: {
  transport: DefaultChatTransport<UIMessage>
}) {
  const chat = useChat({ transport })
  // Published from an effect, not during render: assigning to an outer
  // variable mid-render is the side effect the React lint rule forbids. No
  // dep array, so `api` tracks every render rather than freezing at mount.
  useEffect(() => {
    api = chat
  })
  useEffect(
    () => () => {
      cleanupRan = true
    },
    []
  )
  return null
}

const waitFor = async (predicate: () => boolean, label: string) => {
  for (let i = 0; i < 200; i++) {
    if (predicate()) return
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5))
    })
  }
  throw new Error(`timed out waiting for: ${label}`)
}

const startStreaming = async (captured: Captured) => {
  const transport = new DefaultChatTransport({
    api: "http://chat.test/chat",
    fetch: neverEndingFetch(captured),
  })

  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(createElement(Harness, { transport }))
  })

  await act(async () => {
    // Not awaited: the stream never ends, so this promise never settles.
    void api!.sendMessage({ text: "tell me something long" }).catch(() => {})
  })

  await waitFor(() => api?.status === "streaming", "status === streaming")
  return root
}

beforeEach(() => {
  ;(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  api = null
  cleanupRan = false
})

afterEach(() => {
  document.body.innerHTML = ""
})

describe("in-flight chat request vs. unmount", () => {
  // The control. If this fails, the harness cannot observe aborts at all and
  // the result of the next test would mean nothing.
  it("aborts the request when stop() is called", async () => {
    const captured: Captured = { signal: null }
    const root = await startStreaming(captured)

    expect(captured.signal).not.toBeNull()
    expect(captured.signal!.aborted).toBe(false)

    await act(async () => {
      await api!.stop()
    })

    expect(captured.signal!.aborted).toBe(true)
    await act(async () => root.unmount())
  })

  it("does NOT abort the request when the component unmounts", async () => {
    const captured: Captured = { signal: null }
    const root = await startStreaming(captured)

    expect(captured.signal).not.toBeNull()
    expect(captured.signal!.aborted).toBe(false)

    await act(async () => root.unmount())

    // The unmount really happened — otherwise the assertion below proves nothing.
    expect(cleanupRan).toBe(true)

    // And it is not merely late: give any deferred abort 250ms to land.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250))
    })

    // Documents current behaviour, not desired behaviour.
    expect(captured.signal!.aborted).toBe(false)
  })
})
