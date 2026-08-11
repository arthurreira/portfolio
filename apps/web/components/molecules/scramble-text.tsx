"use client"

import { useEffect, useRef } from "react"
import { animate, useReducedMotion } from "motion/react"
import { LINE_EASE } from "@/lib/motion"

/** Pool the unsettled characters are drawn from. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#$%&+="
/** Seconds to decode, per character. */
const SECONDS_PER_CHAR = 0.035
/** Never snap through a short word, never crawl through a long one. */
const MIN_DURATION_S = 0.45
const MAX_DURATION_S = 1.4

interface ScrambleTextProps {
  text: string
  /** Seconds to wait before decoding starts. */
  delay?: number
  className?: string
}

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "#"
}

/**
 * Builds one frame: everything left of `settled` is the real text, everything
 * right of it is noise. Whitespace is never scrambled, so word boundaries hold
 * still and the line does not reflow while it decodes.
 */
function frame(text: string, settled: number): string {
  let out = ""
  for (let i = 0; i < text.length; i++) {
    const char = text[i] as string
    if (i < settled || char === " ") out += char
    else out += randomGlyph()
  }
  return out
}

/**
 * Decodes text left to right — noise resolving into the real characters.
 *
 * Motion drives the progress value so this shares the site's easing and its
 * reduced-motion handling; the character substitution is plain JS, because a
 * scramble swaps glyphs rather than interpolating a style, which is the only
 * thing an animation library can tween. GSAP's ScrambleTextPlugin does the
 * same job, but it would mean a second animation runtime for one effect.
 *
 * Frames are written straight to the DOM node rather than through state — at
 * 60fps a `setState` per frame would re-render the whole hero ~80 times.
 *
 * Re-runs whenever `text` changes, so a caller can swap the word and get the
 * decode as the transition (see RotatingWord).
 */
export function ScrambleText({ text, delay = 0, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (reduceMotion) {
      node.textContent = text
      return
    }

    const duration = Math.min(
      Math.max(text.length * SECONDS_PER_CHAR, MIN_DURATION_S),
      MAX_DURATION_S
    )

    const controls = animate(0, text.length, {
      duration,
      delay,
      ease: LINE_EASE,
      onUpdate: (settled) => {
        node.textContent = frame(text, settled)
      },
      // Guarantees the real string even if the last frame lands short.
      onComplete: () => {
        node.textContent = text
      },
    })

    return () => controls.stop()
  }, [text, delay, reduceMotion])

  return (
    <>
      {/* The animated copy is noise for most of its life, so it is hidden from
          assistive tech and the real string is exposed once, statically. */}
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden className={className}>
        {text}
      </span>
    </>
  )
}
