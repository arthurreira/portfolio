"use client"

import { useCallback, useRef, useState, type ReactNode } from "react"
import { flushSync } from "react-dom"

import { THEME_TRANSITION } from "@/lib/theme-transition"

type Origin = { x: number; y: number }

// Grow matches the mode-toggle reveal; a short fade hands off to the new state.
const GROW_MS = THEME_TRANSITION.durationMs
const FADE_MS = 300

/** Distance from the origin to the farthest viewport corner. */
function maxRadius({ x, y }: Origin): number {
  return Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )
}

/**
 * Full-screen circular reveal that grows from a click origin, then fades.
 *
 * A clip-path circle expands from `origin` until it covers the screen (the new
 * state is committed via `apply` at that peak), then the overlay fades out to
 * reveal it — the same growing motion as the light/dark mode toggle.
 *
 * `run` takes the overlay content (a flag, a solid panel, …) so one instance
 * serves multiple controls. Pure WAAPI + state, no animation libraries.
 */
export function useCircleReveal() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [fill, setFill] = useState<{ node: ReactNode } | null>(null)

  const run = useCallback((node: ReactNode, origin: Origin, apply: () => void) => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    // No animation: commit immediately and bail.
    if (prefersReduced) {
      apply()
      return
    }

    // Mount synchronously so the ref is live before we animate. No paint happens
    // between flushSync and animate(), so the fill never flashes at full size.
    flushSync(() => setFill({ node }))
    const el = overlayRef.current
    if (!el) {
      apply()
      setFill(null)
      return
    }

    const r = maxRadius(origin)
    const at = `${origin.x}px ${origin.y}px`

    const grow = el.animate(
      [
        { clipPath: `circle(0px at ${at})` },
        { clipPath: `circle(${r}px at ${at})` },
      ],
      { duration: GROW_MS, easing: THEME_TRANSITION.easing, fill: "forwards" },
    )
    grow.onfinish = () => {
      apply() // peak: full coverage — commit the new state underneath
      const fade = el.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: FADE_MS, easing: "ease-out", fill: "forwards" },
      )
      fade.onfinish = () => setFill(null)
    }
  }, [])

  const overlay = fill ? (
    <div
      ref={overlayRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "clip-path, opacity",
      }}
    >
      {fill.node}
    </div>
  ) : null

  return { overlay, run }
}
