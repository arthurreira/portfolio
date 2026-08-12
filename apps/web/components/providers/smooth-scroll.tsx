"use client"

import { ReactLenis } from "lenis/react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <ReactLenis root>{children}</ReactLenis>
}
