"use client"

import { useCallback, useRef, useState } from "react"

/** Set by the Worker when the answer came from the fallback model. */
const DEGRADED_HEADER = "x-chat-degraded"

/**
 * Tracks which replies came from the fallback model.
 *
 * The Worker marks the *response*, but a chat is a list of messages, and the
 * assistant's message does not exist yet when the response headers arrive — its
 * id is generated while the stream is consumed. So the flag is held from the
 * response until the turn settles, then attached to the message that resulted.
 *
 * Marking is per message rather than per panel on purpose: a later question may
 * be answered by the primary model again, and a banner on the whole conversation
 * would keep claiming otherwise.
 */
export function useDegraded() {
  const pending = useRef(false)
  const [degradedIds, setDegradedIds] = useState<ReadonlySet<string>>(new Set())

  /**
   * Wraps `fetch` purely to read a header. The response is passed through
   * untouched — the transport still consumes the body itself.
   */
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

  /**
   * Drops a held flag without attaching it.
   *
   * Needed when a degraded response fails mid-stream: there is no reply to mark,
   * and leaving the flag set would misattribute it to whatever is answered next.
   */
  const discard = useCallback(() => {
    pending.current = false
  }, [])

  return { trackingFetch, degradedIds, settle, discard }
}
