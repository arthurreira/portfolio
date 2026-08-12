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

  // Every word is rendered into the same grid cell, all but one of them
  // invisible. A hidden element still contributes to grid track sizing, so the
  // cell is permanently as wide as the longest word and the line never reflows
  // when the word changes.
  //
  // Without this the span resized on every tick, which re-wrapped the paragraph
  // and nudged everything below it — the "page shaking" while scrolled down.
  // Sizing off the longest *string* would not work: character count is not
  // width in a proportional face.
  return (
    <span className="inline-grid align-baseline">
      {words.map((word) => (
        <span
          key={word}
          aria-hidden
          className="invisible col-start-1 row-start-1 whitespace-nowrap"
        >
          {word}
        </span>
      ))}
      <span className="col-start-1 row-start-1 justify-self-start whitespace-nowrap">
        <ScrambleText text={words[index] ?? ""} className={className} />
      </span>
    </span>
  )
}
