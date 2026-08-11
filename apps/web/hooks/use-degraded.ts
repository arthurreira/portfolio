"use client"

import { useCallback, useRef, useState } from "react"

/** Set by the Worker when the answer came from the fallback model. */
const DEGRADED_HEADER = "x-chat-degraded"

/** Tracks which replies came from the fallback model. */
export function useDegraded() {
  const pending = useRef(false)
  const [degradedIds, setDegradedIds] = useState<ReadonlySet<string>>(new Set())

  /** Wraps `fetch` purely to read a header. */
  const trackingFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const response = await fetch(input, init)
      pending.current = response.headers.get(DEGRADED_HEADER) === "true"
      return response
    },
    []
  )

  /** Attaches a held flag to the finished reply. */
  const settle = useCallback((messageId: string | undefined) => {
    if (!pending.current || !messageId) return
    pending.current = false
    setDegradedIds((previous) => new Set(previous).add(messageId))
  }, [])

  /** Drops a held flag without attaching it. */
  const discard = useCallback(() => {
    pending.current = false
  }, [])

  return { trackingFetch, degradedIds, settle, discard }
}
