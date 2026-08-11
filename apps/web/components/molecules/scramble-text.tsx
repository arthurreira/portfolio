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
 * thing an animation library can tween.
 *
 * Renders exactly one text node. An earlier version paired the animated copy
 * with an sr-only duplicate, which put every heading into the markup twice —
 * visible in copy-paste, in the SSR HTML and to search engines. Instead the
 * real text is server-rendered and the node is only hidden from assistive tech
 * while it is actually noise.
 *
 * Frames are written straight to the DOM node: at 60fps a `setState` per frame
 * would re-render the whole heading ~80 times.
 */
export function ScrambleText({
  text,
  delay = 0,
  className,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Always leave the node holding the real string, whatever happens next.
    const settle = () => {
      node.textContent = text
      node.removeAttribute("aria-hidden")
    }

    if (reduceMotion) {
      settle()
      return
    }

    const duration = Math.min(
      Math.max(text.length * SECONDS_PER_CHAR, MIN_DURATION_S),
      MAX_DURATION_S
    )

    // Hidden only while it is noise — restored the moment it reads correctly.
    node.setAttribute("aria-hidden", "true")

    const controls = animate(0, text.length, {
      duration,
      delay,
      ease: LINE_EASE,
      onUpdate: (settled) => {
        node.textContent = frame(text, settled)
      },
      onComplete: settle,
    })

    return () => {
      controls.stop()
      settle()
    }
  }, [text, delay, reduceMotion])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
