"use client"

import { motion } from "motion/react"
import { cn } from "@arthurreira/ui"
import { LINE_EASE, LineReveal } from "@/components/molecules/line-reveal"

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
 * Hero heading — staggered masked line entrance, and nothing else. The type
 * carries the hierarchy; the only motion is the one-time reveal on load.
 */
export function HeroText({
  greeting,
  firstName,
  lastName,
  subtitle,
  className,
}: HeroTextProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)}>
      {/* h1 gets font-black leading-[0.92] tracking-[-0.045em] from @layer base */}
      <h1 className="text-[clamp(3rem,11.5vw,11.5rem)]">
        <LineReveal className="text-foreground">{greeting}</LineReveal>
        <LineReveal className="text-foreground" delay={LINE_STAGGER_S}>
          {firstName}
        </LineReveal>
        <LineReveal className="text-primary" delay={LINE_STAGGER_S * 2}>
          {lastName}
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
    </div>
  )
}
