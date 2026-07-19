"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

const DOT_SIZE_PX = 6
const RING_SIZE_PX = 36
/** Ring scale while hovering an interactive element. */
const HOVER_SCALE = 1.8
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label"

const FINE_POINTER_QUERY = "(pointer: fine)"

function subscribeFinePointer(onChange: () => void) {
  const media = window.matchMedia(FINE_POINTER_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/** True on devices with a precise pointer (mouse/trackpad); false on server. */
function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER_QUERY).matches,
    () => false
  )
}

/**
 * Custom cursor — an accent dot glued to the pointer with a ring trailing on
 * a spring; the ring scales up over interactive elements. Renders only for
 * fine pointers (desktop) without reduced motion; the native cursor is hidden
 * while active. Touch devices and keyboard users are unaffected.
 */
export function CursorFollower() {
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const enabled = finePointer && !reduceMotion

  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement
    root.classList.add("has-custom-cursor")

    function onMove(e: PointerEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    function onOver(e: PointerEvent) {
      const target = e.target instanceof Element ? e.target : null
      setHovering(Boolean(target?.closest(INTERACTIVE_SELECTOR)))
    }
    function onLeave() {
      setVisible(false)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })
    root.addEventListener("pointerleave", onLeave)
    return () => {
      root.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      root.removeEventListener("pointerleave", onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <style>{`.has-custom-cursor, .has-custom-cursor * { cursor: none !important; }`}</style>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed rounded-full bg-primary"
        style={{
          width: DOT_SIZE_PX,
          height: DOT_SIZE_PX,
          top: -DOT_SIZE_PX / 2,
          left: -DOT_SIZE_PX / 2,
          x,
          y,
          zIndex: 10001,
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed rounded-full border border-primary/60"
        style={{
          width: RING_SIZE_PX,
          height: RING_SIZE_PX,
          top: -RING_SIZE_PX / 2,
          left: -RING_SIZE_PX / 2,
          x: ringX,
          y: ringY,
          zIndex: 10000,
        }}
        animate={{ scale: hovering ? HOVER_SCALE : 1, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  )
}
