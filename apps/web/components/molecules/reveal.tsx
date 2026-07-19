"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Extra delay (seconds) for staggering sibling reveals. */
  delay?: number
  /** Vertical offset to rise from (px). */
  y?: number
  /** When false, re-animates on every viewport entry (hides on exit). */
  once?: boolean
}

/**
 * Shared motion props for scroll-triggered reveals — spread onto any motion
 * element (`<motion.h2 {...revealMotionProps()} />`) when a wrapper div would
 * break semantics (list items, headings inside prose).
 */
export function revealMotionProps(delay = 0, y = 16, once = true) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once, margin: "0px 0px -12% 0px" as const },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const, delay },
  }
}

/**
 * Scroll-triggered entrance — fades and rises into place once as it enters the
 * viewport. Shared by the project list and the project detail page.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  once = true,
}: RevealProps) {
  return (
    <motion.div className={className} {...revealMotionProps(delay, y, once)}>
      {children}
    </motion.div>
  )
}
