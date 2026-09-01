"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { getRotationAdvanceLimit } from "@/lib/rotation"

const DEFAULT_HOLD_MS = 2600

interface RotatingWordProps {
  words: string[]
  holdMs?: number
  /** Number of complete sequences to show. Omit to keep cycling. */
  cycles?: number
  /** Reserve the longest word's width to prevent surrounding text reflow. */
  reserveWidth?: boolean
  className?: string
}

/** Cycles a word in place. */
export function RotatingWord({
  words,
  holdMs = DEFAULT_HOLD_MS,
  cycles,
  reserveWidth = true,
  className,
}: RotatingWordProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const advanceLimit = getRotationAdvanceLimit(words.length, cycles)

  useEffect(() => {
    if (reduceMotion || words.length < 2 || advanceLimit === 0) return

    let advances = 0
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % words.length)
      advances += 1

      if (advanceLimit !== undefined && advances >= advanceLimit) {
        clearInterval(id)
      }
    }, holdMs)

    return () => clearInterval(id)
  }, [advanceLimit, reduceMotion, words.length, holdMs])

  if (reduceMotion || words.length < 2) return <>{words[0] ?? ""}</>

  if (!reserveWidth) {
    return (
      <span className="inline-block align-baseline whitespace-nowrap">
        <ScrambleText text={words[index] ?? ""} className={className} />
      </span>
    )
  }

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
