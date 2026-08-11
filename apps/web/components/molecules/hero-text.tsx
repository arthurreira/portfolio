"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@arthurreira/ui"
import { LINE_EASE, SEGMENT_STAGGER_S } from "@/lib/motion"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { RotatingWord } from "@/components/molecules/rotating-word"

/** Stages cycle faster than the greeting — there are eight of them. */
const STAGE_HOLD_MS = 1600

interface HeroTextProps {
  /** The locale's ways of saying hello; the first word cycles through them. */
  greetings: string[]
  /** What follows the greeting on the same line — "I'm", "mä oon", "eu sou". */
  intro: string
  firstName: string
  lastName: string
  subtitle: ReactNode
  /** "DevSecOps is a culture —", the lead-in to the cycling stage. */
  cultureLine: string
  /** Plan, Code, Build, Test, Release, Deploy, Operate, Monitor. */
  stages: string[]
  className?: string
}

/** Delay (s) between each segment of the heading starting to decode. */

/** Hero heading — the name decodes out of noise on load, segment by segment. */
export function HeroText({
  greetings,
  intro,
  firstName,
  lastName,
  subtitle,
  cultureLine,
  stages,
  className,
}: HeroTextProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)}>
      <h1 className="text-display">
        <span className="block">
          <RotatingWord words={greetings} />,{" "}
          <ScrambleText text={intro} delay={SEGMENT_STAGGER_S} />
        </span>
        <span className="block">
          <ScrambleText
            text={firstName}
            delay={SEGMENT_STAGGER_S * 2}
            className="text-foreground"
          />{" "}
          <ScrambleText
            text={lastName}
            delay={SEGMENT_STAGGER_S * 3}
            className="text-primary"
          />
        </span>
      </h1>

      <motion.p
        className="text-lead text-muted-foreground"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: LINE_EASE, delay: 0.45 }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: LINE_EASE, delay: 0.55 }}
      >
        {cultureLine}{" "}
        <span className="text-primary">
          <RotatingWord words={stages} holdMs={STAGE_HOLD_MS} />
        </span>
      </motion.p>
    </div>
  )
}
