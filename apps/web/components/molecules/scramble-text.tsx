"use client"

import { useEffect, useRef } from "react"
import { animate, useReducedMotion } from "motion/react"
import { LINE_EASE } from "@/lib/motion"

// Noise matches the class of the character it replaces.
const POOLS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digit: "0123456789",
  symbol: "#$%&*+=<>/\\",
} as const

const SECONDS_PER_CHAR = 0.035
const MIN_DURATION_S = 0.45
const MAX_DURATION_S = 1.4

interface ScrambleTextProps {
  text: string
  delay?: number
  className?: string
}

function poolFor(char: string): string {
  if (/\p{Ll}/u.test(char)) return POOLS.lower
  if (/\p{Lu}/u.test(char)) return POOLS.upper
  if (/\p{Nd}/u.test(char)) return POOLS.digit
  return POOLS.symbol
}

function randomGlyph(char: string): string {
  const pool = poolFor(char)
  return pool[Math.floor(Math.random() * pool.length)] ?? "#"
}

// Whitespace is never scrambled, so word boundaries hold still.
function frame(text: string, settled: number): string {
  let out = ""
  for (let i = 0; i < text.length; i++) {
    const char = text[i] as string
    if (i < settled || char === " ") out += char
    else out += randomGlyph(char)
  }
  return out
}

/** Decodes text left to right. */
export function ScrambleText({ text, delay = 0, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

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

    node.setAttribute("aria-hidden", "true")

    const controls = animate(0, text.length, {
      duration,
      delay,
      ease: LINE_EASE,
      // Written to the node directly: a setState per frame would re-render the
      // whole heading ~80 times.
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

  // One text node, server-rendered with the real string — an sr-only twin
  // would put every heading into the markup twice.
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
