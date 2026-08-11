"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"
import { ScrambleText } from "@/components/molecules/scramble-text"

const DEFAULT_HOLD_MS = 2600

interface RotatingWordProps {
  words: string[]
  holdMs?: number
  className?: string
}

/** Cycles a word in place. */
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

  if (reduceMotion || words.length < 2) return <>{words[0] ?? ""}</>

  return <ScrambleText text={words[index] ?? ""} className={className} />
}
