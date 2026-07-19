"use client"

import { motion, useScroll, useSpring } from "motion/react"

/**
 * Scroll-driven progress bar pinned to the top of the viewport. Reads window
 * scroll (which Lenis drives via `<ReactLenis root>`), so the bar inherits the
 * same smoothing as the page itself.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-primary fixed inset-x-0 top-0 z-50 h-0.5 origin-left"
    />
  )
}
