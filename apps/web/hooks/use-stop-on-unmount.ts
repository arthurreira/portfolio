"use client"

import { useEffect, useRef } from "react"

/**
 * Aborts an in-flight chat request when the component unmounts — `useChat` has
 * no cleanup of its own, so the request otherwise outlives the component that
 * started it and streams on against nothing.
 *
 * `stop` goes through a ref rather than an effect dependency. It happens to be
 * stable in @ai-sdk/react 4 — the Chat instance survives a transport change —
 * but the object `useChat` returns is rebuilt every render, and a cleanup wired
 * to anything per-render aborts a live stream on re-render instead of an
 * abandoned one on unmount. The ref keeps that from depending on which.
 */
export function useStopOnUnmount(stop: () => void | Promise<void>) {
  const stopRef = useRef(stop)

  useEffect(() => {
    stopRef.current = stop
  })

  useEffect(
    () => () => {
      void stopRef.current()
    },
    []
  )
}
