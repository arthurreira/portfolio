"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { LINE_EASE } from "@/components/molecules/line-reveal"

/** Default hold before the next word rolls up. */
const DEFAULT_HOLD_MS = 2600

interface RotatingWordProps {
  /** Cycled in order, looping. The first is what non-animated readers get. */
  words: string[]
  /** How long each word holds, in ms. */
  holdMs?: number
  className?: string
}

/**
 * One word in a slot, cycling: the current word rolls up and out while the
 * next rolls in from below. Used for the hero greeting (Morjens / Moi / Terve)
 * and the DevSecOps stages (Plan / Code / Build …).
 *
 * The animated copy is aria-hidden with a single static word exposed instead —
 * otherwise assistive tech announces changed content every couple of seconds.
 * Reduced-motion readers get that same static word and no timer is started.
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

  const first = words[0] ?? ""

  if (reduceMotion || words.length < 2) return <>{first}</>

  return (
    <>
      <span className="sr-only">{first}</span>
      {/* overflow-hidden makes the slot. LineReveal unclips itself after its
          entrance, so this mask is the only one still in play. */}
      <span
        aria-hidden
        className={`inline-flex overflow-hidden align-bottom ${className ?? ""}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            className="block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: LINE_EASE }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}
