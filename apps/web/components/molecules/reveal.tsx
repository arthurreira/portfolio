"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { LINE_EASE } from "@/lib/motion"

interface RevealProps {
  children: ReactNode
  /** Seconds, for staggering two or three blocks that share a screen. */
  delay?: number
  className?: string
}

/**
 * Reveals a block as it enters the viewport. Used on the long pages only —
 * about and a project page — where the reader travels far enough for arrival
 * to mean something. Home, projects and contact stay static; a section that
 * animates before you have finished reading the heading above it is noise.
 *
 * `once` is not optional. Re-running on every pass makes scrolling back up feel
 * broken, and this fires on blocks a reader may well scroll past twice.
 *
 * prefers-reduced-motion is honoured by the MotionConfig in the route template,
 * which wraps every page.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Fires a little before the block is fully on screen, so it has finished
      // by the time it is actually being read rather than moving under the eye.
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.5, ease: LINE_EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
