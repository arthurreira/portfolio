"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@arthurreira/ui"
import { LINE_EASE, LineReveal } from "@/components/molecules/line-reveal"
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

/** Entrance stagger (s) between hero lines. */
const LINE_STAGGER_S = 0.09

/**
 * Hero heading — staggered masked line entrance, and nothing else. The type
 * carries the hierarchy; the only motion is the one-time reveal on load.
 */
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
      {/* h1 gets font-bold leading-[1.1] tracking-[-0.02em] from @layer base */}
      <h1 className="text-display">
        <LineReveal delay={LINE_STAGGER_S}>
          {/* {" "} is load-bearing: JSX drops whitespace at a line break, so
              without it the intro runs straight into the first name. */}
          <RotatingWord words={greetings} />, {intro}{" "}
          <span className="text-foreground">{firstName} </span>
          <span className="text-primary">{lastName}</span>
        </LineReveal>
      </h1>

      <motion.p
        className="text-lead text-muted-foreground"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: LINE_EASE, delay: 0.45 }}
      >
        {subtitle}
      </motion.p>

      {/* Smaller than the subtitle on purpose — it is a note under the role,
          not a second claim competing with it. */}
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
