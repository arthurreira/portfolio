"use client"

import { motion } from "motion/react"
import { cn } from "@arthurreira/ui"
import { LINE_EASE, SEGMENT_STAGGER_S } from "@/lib/motion"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { RotatingWord } from "@/components/molecules/rotating-word"

/** Stages cycle faster than the greeting — there are eight of them. */
const STAGE_HOLD_MS = 1600

interface HeroTextProps {
  firstName: string
  lastName: string
  /** "I work as a Software Engineer —", the lead-in to the cycling stage. */
  roleLine: string
  /** Plan, Code, Build, Test, Release, Deploy, Operate, Monitor. */
  stages: string[]
  className?: string
}

/** Delay (s) between each segment of the heading starting to decode. */

/** Hero heading — the name decodes out of noise on load, segment by segment. */
export function HeroText({
  firstName,
  lastName,
  roleLine,
  stages,
  className,
}: HeroTextProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)}>
      {/* The name and nothing else, on the same two lines the about page uses.
          The cycling greeting used to own the first line, so the largest type
          on the site was a word that changed every couple of seconds rather
          than the one thing a visitor is here to read. */}
      <h1 className="text-hero">
        <span className="block">
          <ScrambleText text={firstName} className="text-foreground" />
        </span>
        <span className="block">
          <ScrambleText
            text={lastName}
            delay={SEGMENT_STAGGER_S}
            className="text-primary"
          />
        </span>
      </h1>

      {/* One line, promoted from the small print. It replaced "I work as a
          Software Engineer at Nordcloud" — which named the employer twice on
          one screen, since the trust band right below says the same thing, and
          spent the hero's best line on where he works rather than how. */}
      <motion.p
        className="text-lead text-muted-foreground"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: LINE_EASE, delay: 0.45 }}
      >
        {roleLine}{" "}
        <span className="text-primary">
          <RotatingWord words={stages} holdMs={STAGE_HOLD_MS} />
        </span>
      </motion.p>
    </div>
  )
}
