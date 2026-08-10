"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { LINE_EASE } from "@/components/molecules/line-reveal"

/** How long each greeting holds before the next rolls up. */
const HOLD_MS = 2600

interface RotatingGreetingProps {
  /** Per-locale greetings, e.g. Morjens / Moi / Terve / Moikka / Hei. */
  greetings: string[]
}

/**
 * The first word of the hero, cycling through the locale's ways of saying
 * hello. One slot rolls up and the next rolls in from below.
 *
 * The rotation is decorative, so the animated copy is aria-hidden and a single
 * static greeting is exposed to screen readers — otherwise assistive tech would
 * announce a new heading every 2.6 seconds. Reduced-motion users get that same
 * static first greeting and no timer.
 */
export function RotatingGreeting({ greetings }: RotatingGreetingProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || greetings.length < 2) return
    const id = setInterval(
      () => setIndex((n) => (n + 1) % greetings.length),
      HOLD_MS
    )
    return () => clearInterval(id)
  }, [reduceMotion, greetings.length])

  const first = greetings[0] ?? ""

  if (reduceMotion || greetings.length < 2) return <>{first}</>

  return (
    <>
      <span className="sr-only">{first}</span>
      {/* overflow-hidden makes the slot; LineReveal above unclips itself after
          its entrance, so this mask is the only one still in play. */}
      <span aria-hidden className="inline-flex overflow-hidden align-bottom">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={greetings[index]}
            className="block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: LINE_EASE }}
          >
            {greetings[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}
