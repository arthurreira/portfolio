"use client"

import { useEffect, useRef, useState } from "react"
import { useAnalytics } from "@arthurreira/analytics/client"
import { Badge, Button, cn } from "@arthurreira/ui"
import { Input } from "@arthurreira/ui/components/input"

type CapturedRequest = {
  id: number
  endpoint: string
  method: string
  payload: unknown
  ts: Date
}

let nextId = 0

function useRequestCapture() {
  const [entries, setEntries] = useState<CapturedRequest[]>([])

  useEffect(() => {
    const original = window.fetch

    window.fetch = async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : (input as Request).url

      const isAnalytics =
        url.includes("/events") || url.includes("/sessions")

      if (isAnalytics && init?.method?.toUpperCase() === "POST") {
        try {
          const payload = init.body ? JSON.parse(init.body as string) : null
          const endpoint = url.replace(/^https?:\/\/[^/]+/, "")
          setEntries((prev) => [
            { id: nextId++, endpoint, method: "POST", payload, ts: new Date() },
            ...prev,
          ])
        } catch {
          // body wasn't JSON — ignore
        }
      }

      return original(input, init)
    }

    return () => {
      window.fetch = original
    }
  }, [])

  return { entries, clear: () => setEntries([]) }
}

function triggerWindowError(error: Error) {
  window.dispatchEvent(
    new ErrorEvent("error", {
      message: error.message,
      error,
      bubbles: true,
      cancelable: true,
    })
  )
}

export default function SdkTestPage() {
  const apiUrl = process.env.NEXT_PUBLIC_ANALYTICS_URL ?? ""
  const apiKey = process.env.NEXT_PUBLIC_ANALYTICS_KEY ?? ""

  const { trackCTA, trackSearch } = useAnalytics(apiUrl, apiKey)
  const { entries, clear } = useRequestCapture()

  const [searchQuery, setSearchQuery] = useState("")

  function handleSearch() {
    if (!searchQuery.trim()) return
    trackSearch(searchQuery.trim())
    setSearchQuery("")
  }

  return (
    <div className="flex min-h-screen gap-0 pt-12">
      {/* ── Left: trigger panel ── */}
      <aside className="w-64 shrink-0 border-r border-border p-4 flex flex-col gap-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          SDK Test Panel
        </p>

        {/* Errors */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-mono">Errors</p>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() =>
              triggerWindowError(
                new TypeError("Cannot read properties of null (reading 'foo')")
              )
            }
          >
            Trigger TypeError
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() =>
              triggerWindowError(
                new ReferenceError("undefinedFunction is not defined")
              )
            }
          >
            Trigger ReferenceError
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              void Promise.reject(new Error("unhandled rejection: test"))
            }}
          >
            Unhandled rejection
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-mono leading-tight">
            ↑ SDK does not track unhandledrejection — nothing will appear in
            the feed
          </p>
        </section>

        {/* Auto-tracked interactions */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-mono">
            Auto-tracked
          </p>
          <Button variant="secondary" className="w-full justify-start">
            Click me
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-mono leading-tight select-text">
            Select and copy this text → triggers a copy event.
          </p>
          <div className="h-28 overflow-y-auto border border-border p-2 text-[10px] text-muted-foreground font-mono leading-relaxed">
            {Array.from({ length: 30 }, (_, i) => (
              <p key={i}>
                Scroll line {i + 1} — depth fires at 25 / 50 / 75 / 100%
              </p>
            ))}
          </div>
        </section>

        {/* Search */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-mono">Search</p>
          <Input
            placeholder="Type query…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSearch}
          >
            Track search
          </Button>
        </section>

        {/* CTA */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-mono">CTA</p>
          <Button
            className="w-full justify-start"
            data-cta-id="hero-cta"
            data-cta-variant="variant-a"
            onClick={() => trackCTA("hero-cta", "variant-a")}
          >
            CTA — hero-cta / variant-a
          </Button>
        </section>
      </aside>

      {/* ── Right: live request feed ── */}
      <main className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-mono text-muted-foreground">
            Captured requests{" "}
            <Badge variant="secondary" className="ml-1">
              {entries.length}
            </Badge>
          </span>
          <Button variant="ghost" size="xs" onClick={clear}>
            Clear log
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {entries.length === 0 && (
            <p className="text-xs text-muted-foreground font-mono">
              No requests captured yet. Trigger an event on the left.
            </p>
          )}

          {entries.map((entry) => (
            <div key={entry.id} className="border border-border font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border px-3 py-1.5 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      entry.endpoint.includes("sessions")
                        ? "secondary"
                        : "outline"
                    }
                    className={cn(
                      (entry.payload as Record<string, unknown>)
                        ?.event_type === "error" &&
                        "border-destructive/40 text-destructive"
                    )}
                  >
                    {entry.method}
                  </Badge>
                  <span className="text-foreground">{entry.endpoint}</span>
                  {(entry.payload as Record<string, unknown>)?.event_type && (
                    <Badge variant="outline">
                      {
                        (entry.payload as Record<string, unknown>)
                          .event_type as string
                      }
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground text-[10px]">
                  {entry.ts.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    // @ts-expect-error — non-standard but supported in modern browsers
                    fractionalSecondDigits: 3,
                  })}
                </span>
              </div>
              <pre className="px-3 py-2 text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(entry.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
