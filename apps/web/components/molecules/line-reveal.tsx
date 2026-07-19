"use client"

import { useState, type ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@arthurreira/ui"

interface LineRevealProps {
  children: ReactNode
  className?: string
  /** Extra delay (seconds) for staggering sibling lines. */
  delay?: number
}

/** Shared ease for masked line entrances (matches the hero). */
export const LINE_EASE = [0.22, 1, 0.36, 1] as const

/**
 * Masked line entrance — content rises out of an overflow-hidden wrapper on
 * mount, then unclips so proximity-lifted letters aren't chopped by the mask.
 * Used inside the big page headings. Honors reduced motion via the
 * page-level MotionConfig.
 */
export function LineReveal({ children, className, delay = 0 }: LineRevealProps) {
  const [entered, setEntered] = useState(false)
  return (
    <span
      className={cn(
        "block",
        entered ? "overflow-visible" : "overflow-hidden",
        className
      )}
    >
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: LINE_EASE, delay }}
        onAnimationComplete={() => setEntered(true)}
      >
        {children}
      </motion.span>
    </span>
  )
}
