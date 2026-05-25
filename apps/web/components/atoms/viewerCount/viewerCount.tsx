"use client"

import { useEffect, useState } from "react"
import { Badge, cn } from "@arthurreira/ui"
import type { ViewerCountProps } from "./viewerCountProps"

const WS_URL = process.env.NEXT_PUBLIC_ANALYTICS_WS_URL ?? ""
const API_KEY = process.env.NEXT_PUBLIC_ANALYTICS_KEY ?? ""

export function ViewerCount({ className }: ViewerCountProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let ws: WebSocket | null = null
    let cancelled = false
    let attempts = 0

    const connect = () => {
      if (cancelled) return
      const sessionId = localStorage.getItem("af_session_id")
      if (!sessionId) {
        if (++attempts < 20) setTimeout(connect, 300)
        return
      }
      if (!WS_URL || !API_KEY) return
      ws = new WebSocket(`${WS_URL}?api_key=${API_KEY}&session_id=${sessionId}`)
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data as string)
          if (data.type === "count" && typeof data.active === "number") {
            setCount(data.active)
          }
        } catch (e: unknown) {
          void e
        }
      }
    }

    connect()
    return () => {
      cancelled = true
      ws?.close()
    }
  }, [])

  if (count < 1) return null

  return (
    <Badge variant="outline" className={cn("gap-1.5 text-muted-foreground", className)}>
      <span className="size-1.5 rounded-full bg-emerald-500" />
      {count} viewing
    </Badge>
  )
}
