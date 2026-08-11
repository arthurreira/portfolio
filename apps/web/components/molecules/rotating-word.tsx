"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"
import { ScrambleText } from "@/components/molecules/scramble-text"

/** Default hold before the next word decodes in. */
const DEFAULT_HOLD_MS = 2600

interface RotatingWordProps {
  /** Cycled in order, looping. The first is what non-animated readers get. */
  words: string[]
  /** How long each word holds, in ms. */
  holdMs?: number
  className?: string
}

/**
 * One word in a slot, cycling. The transition is the decode itself: this only
 * owns the timer, and ScrambleText re-runs whenever the word changes.
 *
 * It used to roll the old word up and the new one in from below. That was a
 * second motion language in a hero that now decodes, so the roll went and the
 * scramble carries both.
 *
 * Reduced-motion readers get the first word and no timer is started.
 */
export function RotatingWord({
  words,
  holdMs = DEFAULT_HOLD_MS,
  className,
}: RotatingWordProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || words.length < 2) return
    const id = setInterval(
      () => setIndex((n) => (n + 1) % words.length),
      holdMs
    )
    return () => clearInterval(id)
  }, [reduceMotion, words.length, holdMs])

  const word = words[index] ?? ""

  if (reduceMotion || words.length < 2) return <>{words[0] ?? ""}</>

  return <ScrambleText text={word} className={className} />
}
