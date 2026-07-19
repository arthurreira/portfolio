"use client"

import { useState } from "react"
import { Badge } from "@arthurreira/ui"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

const TICKER_ITEMS = [
  "AWS CLOUD PRACTITIONER",
  "AZURE FUNDAMENTALS",
  "AWS AI CLOUD PRACTITIONER",
  "AZURE AI FUNDAMENTALS",
]

const HALF = Array(10).fill(TICKER_ITEMS).flat()

/** Seconds for one full loop (half of the doubled track). */
const LOOP_DURATION_S = 120
/** Hover eases the ticker to a stop and back — no hard freeze. */
const SPEED_SPRING = { stiffness: 60, damping: 20 }
/** Resting opacity; hover brings the strip to full strength. */
const IDLE_OPACITY = 0.75
/** Poster-scale type so the strip's reserved width doesn't sit empty. */
const TICKER_TYPE_CLASS = "text-[1.35rem] leading-tight font-black"

function TickerItems({ prefix }: { prefix: string }) {
  return (
    <>
      {HALF.map((item, i) => (
        <span key={`${prefix}${i}`}>
          <Badge
            variant="outline"
            // h-auto frees the badge's fixed h-5 (it would clamp vertical text).
            className={`h-auto rounded-full border-none ${TICKER_TYPE_CLASS}`}
          >
            {item}
          </Badge>
          <span className={`text-primary ${TICKER_TYPE_CLASS}`}> · </span>
        </span>
      ))}
    </>
  )
}

/**
 * Motion-driven vertical ticker — a frame loop advances the track, so hover
 * can spring the speed to zero (and back) while the strip brightens and
 * grows slightly. Static under reduced motion.
 */
export function VerticalTicker() {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  // 0..50 — percent of the doubled track; -50% is exactly one copy.
  const progress = useMotionValue(0)
  const speed = useSpring(1, SPEED_SPRING)
  const transform = useMotionTemplate`translateY(-${progress}%)`

  useAnimationFrame((_, deltaMs) => {
    if (reduceMotion) return
    const step = (50 / LOOP_DURATION_S) * (deltaMs / 1000) * speed.get()
    progress.set((progress.get() + step) % 50)
  })

  function setPaused(paused: boolean) {
    setHovered(paused)
    speed.set(paused ? 0 : 1)
  }

  return (
    <div
      aria-hidden
      className="t-sidebar fixed left-0 top-0 h-screen overflow-hidden flex justify-center"
      style={{ width: "clamp(44px, 5vw, 72px)", zIndex: 9999 }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* rotate wrapper — keeps rotate(180deg) out of the animation */}
      <motion.div
        className="ticker-wrapper"
        animate={{
          scale: hovered ? 1.04 : 1,
          opacity: hovered ? 1 : IDLE_OPACITY,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div className="ticker-track" style={{ transform }}>
          <TickerItems prefix="a" />
          <TickerItems prefix="b" />
        </motion.div>
      </motion.div>
    </div>
  )
}
