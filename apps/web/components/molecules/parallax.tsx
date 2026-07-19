"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "motion/react"

interface ParallaxProps {
  children: ReactNode
  className?: string
  /** Max vertical drift (px) as the element travels through the viewport. */
  amount?: number
}

/**
 * Scroll-driven parallax — children drift vertically as they cross the
 * viewport, inheriting Lenis's smoothing since it drives the root scroll.
 * Wrap around `Reveal` to compose with the entrance animation.
 */
export function Parallax({ children, className, amount = 16 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
