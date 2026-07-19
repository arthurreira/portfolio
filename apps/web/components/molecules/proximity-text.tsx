"use client"

import { useRef, type ReactNode } from "react"
import { useReducedMotion } from "motion/react"

/** Distance (px) within which letters start reacting to the cursor. */
const PROXIMITY_RADIUS_PX = 140
/** Max upward lift (px) for a letter directly under the cursor. */
const MAX_LIFT_PX = 12

export type ProximityTone = "default" | "primary"

/** Default-toned letters shift toward the accent; accent-toned letters shift
 *  toward the foreground (inverse highlight). */
function proximityColor(tone: ProximityTone, strength: number): string {
  const pct = Math.round(strength * 100)
  return tone === "primary"
    ? `color-mix(in oklab, var(--foreground) ${pct}%, var(--primary))`
    : `color-mix(in oklab, var(--primary) ${pct}%, var(--foreground))`
}

interface ProximityLettersProps {
  text: string
  tone?: ProximityTone
}

/**
 * Splits text into per-letter spans that react to the cursor inside the
 * nearest `ProximityArea`. Spaces stay plain text nodes so words keep their
 * spacing and long lines can wrap.
 */
export function ProximityLetters({
  text,
  tone = "default",
}: ProximityLettersProps) {
  return (
    <>
      {Array.from(text).map((char, i) =>
        char === " " ? (
          " "
        ) : (
          <span
            key={`${char}-${i}`}
            data-letter={tone}
            className="inline-block transition-[transform,color] duration-200 ease-out will-change-transform"
          >
            {char}
          </span>
        )
      )}
    </>
  )
}

interface ProximityAreaProps {
  children: ReactNode
  className?: string
}

/**
 * Pointer-tracking container for the proximity type effect: letters rendered
 * by `ProximityLetters` anywhere inside lift and shift color as the mouse
 * nears them, settling back via their own CSS transitions. One listener per
 * area, imperative style updates only — no per-letter React state. Mouse
 * only; touch and reduced-motion users get static text.
 */
export function ProximityArea({ children, className }: ProximityAreaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  function eachLetter(fn: (el: HTMLSpanElement) => void) {
    ref.current?.querySelectorAll<HTMLSpanElement>("[data-letter]").forEach(fn)
  }

  function handlePointerMove(e: React.PointerEvent) {
    // Mouse only — on touch, a scrolling finger would drag letters around.
    if (reduceMotion || e.pointerType !== "mouse") return
    eachLetter((el) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const strength = Math.max(0, 1 - Math.hypot(dx, dy) / PROXIMITY_RADIUS_PX)
      el.style.transform =
        strength > 0 ? `translateY(${-(strength * MAX_LIFT_PX)}px)` : ""
      el.style.color =
        strength > 0
          ? proximityColor(el.dataset.letter as ProximityTone, strength)
          : ""
    })
  }

  function handlePointerLeave() {
    eachLetter((el) => {
      el.style.transform = ""
      el.style.color = ""
    })
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className}
    >
      {children}
    </div>
  )
}
