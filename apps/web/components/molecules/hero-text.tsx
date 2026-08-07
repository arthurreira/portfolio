"use client"

import { motion } from "motion/react"
import { cn } from "@arthurreira/ui"
import { LINE_EASE, LineReveal } from "@/components/molecules/line-reveal"
import {
  ProximityArea,
  ProximityLetters,
} from "@/components/molecules/proximity-text"

interface HeroTextProps {
  greeting: string
  firstName: string
  lastName: string
  subtitle: string
  className?: string
}

/** Entrance stagger (s) between hero lines. */
const LINE_STAGGER_S = 0.09

/**
 * Hero heading — staggered masked line entrance plus the proximity type
 * effect (letters near the cursor lift and shift color). Both behaviors are
 * the shared molecules also used by the page headers.
 */
export function HeroText({
  greeting,
  firstName,
  lastName,
  subtitle,
  className,
}: HeroTextProps) {
  return (
    <ProximityArea className={cn("flex flex-col gap-4 sm:gap-6", className)}>
      {/* h1 gets font-black leading-[0.92] tracking-[-0.045em] from @layer base */}
      <h1 className="text-[clamp(3rem,11.5vw,11.5rem)]">
        <LineReveal className="text-foreground">
          <ProximityLetters text={greeting} />
        </LineReveal>
        <LineReveal className="text-foreground" delay={LINE_STAGGER_S}>
          <ProximityLetters text={firstName} />
        </LineReveal>
        <LineReveal className="text-primary" delay={LINE_STAGGER_S * 2}>
          <ProximityLetters text={lastName} tone="primary" />
        </LineReveal>
      </h1>

      <motion.p
        className="text-[clamp(1rem,3.5vw,1.5rem)] text-muted-foreground"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: LINE_EASE, delay: 0.45 }}
      >
        {subtitle}
      </motion.p>
    </ProximityArea>
  )
}
