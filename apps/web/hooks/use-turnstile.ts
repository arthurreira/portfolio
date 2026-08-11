"use client"

import { useCallback, useRef, useState } from "react"
import type { TurnstileInstance } from "@marsidev/react-turnstile"

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** How long to wait for a challenge to resolve before giving up. */
const TOKEN_TIMEOUT_MS = 15_000

/**
 * Owns the Turnstile widget and hands out one token per message.
 *
 * Tokens are single-use and expire after a few minutes, so a token obtained
 * when the panel opened cannot be reused for the second message — every send
 * needs its own. `reset` then `execute` forces a fresh one; in Managed mode a
 * visitor already judged low-risk clears it invisibly.
 *
 * With no site key configured the hook is inert and returns undefined, which
 * mirrors the Worker skipping verification when it has no secret. That keeps
 * local development runnable without any Turnstile keys.
 */
export function useTurnstile() {
  const ref = useRef<TurnstileInstance | null>(null)
  // Surfaced so the panel can say the bot check failed rather than showing the
  // generic error.
  const [hasFailed, setHasFailed] = useState(false)

  const getToken = useCallback(async (): Promise<string | undefined> => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return undefined

    try {
      ref.current.reset()
      ref.current.execute()
      const token = await ref.current.getResponsePromise(TOKEN_TIMEOUT_MS)
      setHasFailed(false)
      return token
    } catch (error) {
      setHasFailed(true)
      // Let the send proceed without a token; the Worker is the one that
      // decides, and it refuses. Failing here would only hide the reason.
      console.error("turnstile token failed", error)
      return undefined
    }
  }, [])

  return { ref, getToken, hasFailed, enabled: Boolean(TURNSTILE_SITE_KEY) }
}
