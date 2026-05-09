// src/hooks/useMountedAfter.ts
"use client"
import { useEffect, useState } from "react"

export function useMountedAfter(delay: number = 100): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return mounted
}