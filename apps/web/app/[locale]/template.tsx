"use client"

import type { ReactNode } from "react"
import { motion, MotionConfig } from "motion/react"

/**
 * App Router `template` re-mounts on every navigation, so this gives each page
 * a fresh enter transition (fade + slight rise). `reducedMotion="user"` honors
 * the OS "reduce motion" setting.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
