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
}

/**
 * Scroll-triggered entrance — fades and rises into place once as it enters the
 * viewport. Shared by the project list and the project detail page.
 */
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
