"use client"

import { useState, useEffect, useRef } from "react"
import { flushSync } from "react-dom"
import { useTranslations } from "next-intl"
import { Sun, Moon } from "@phosphor-icons/react/ssr"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arthurreira/ui/components/tooltip"
import { Separator } from "@arthurreira/ui/client"
import { PillGroup } from "@/components/molecules/pill-group"
import { useCircleReveal } from "@/components/molecules/circle-reveal"
import { FlagFill, FlagPillFill } from "@/components/atoms/flag-icons"
import { THEME_TRANSITION } from "@/lib/theme-transition"
import { setAxis } from "@/lib/theme-axis"

// Full-bleed flags: no padding box, dimmed and desaturated when inactive, full
// colour when active (via aria-pressed set by PillButton).
const FLAG_PILL_CLASS =
  "overflow-hidden p-0 opacity-60 saturate-50 transition-all hover:opacity-100 aria-pressed:opacity-100 aria-pressed:saturate-100"

const FLAGS = [
  {
    key: "brasil",
    label: <FlagPillFill flag="brasil" />,
    ariaLabel: "Brasil",
    className: FLAG_PILL_CLASS,
  },
  {
    key: "suomi",
    label: <FlagPillFill flag="suomi" />,
    ariaLabel: "Suomi",
    className: FLAG_PILL_CLASS,
  },
]

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> }
}

/**
 * Theme (Brasil/Suomi) and mode (light/dark), plus the `d` shortcut.
 *
 * Language used to live here too. It moved to the nav: on a site whose default
 * locale is Finnish, switching language is how a visitor gets to a page they
 * can read, which makes it navigation rather than a preference.
 */
export function SiteSwitchers() {
  const tTheme = useTranslations("theme")
  const tTip = useTranslations("tooltips")

  const MODES = [
    { key: "dark", label: <Moon weight="fill" />, ariaLabel: tTheme("dark") },
    { key: "light", label: <Sun weight="fill" />, ariaLabel: tTheme("light") },
  ]

  const [flag, setFlag] = useState("brasil")
  const [mode, setMode] = useState("dark")
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const { overlay: revealOverlay, run: runReveal } = useCircleReveal()

  function originFromPointer() {
    return (
      pointer.current ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }
    )
  }

  // Sync from DOM on mount + tab visibility change
  useEffect(() => {
    function sync() {
      setFlag(document.documentElement.getAttribute("data-flag") ?? "brasil")
      setMode(document.documentElement.getAttribute("data-mode") ?? "dark")
    }
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [])

  function applyFlag(val: string) {
    setAxis("flag", "arthur-flag", val)
    flushSync(() => setFlag(val))
  }

  function pickFlag(val: string) {
    if (val === flag) return
    runReveal(<FlagFill flag={val} />, originFromPointer(), () =>
      applyFlag(val)
    )
  }

  function applyMode(val: string) {
    setAxis("mode", "arthur-mode", val)
    flushSync(() => setMode(val))
  }

  function pickMode(val: string) {
    const doc = document as ViewTransitionDoc
    if (!doc.startViewTransition) {
      applyMode(val)
      return
    }
    const o = pointer.current ?? { x: window.innerWidth, y: 0 }
    const endRadius = Math.hypot(
      Math.max(o.x, window.innerWidth - o.x),
      Math.max(o.y, window.innerHeight - o.y)
    )
    const transition = doc.startViewTransition(() => applyMode(val))
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${o.x}px ${o.y}px)`,
            `circle(${endRadius}px at ${o.x}px ${o.y}px)`,
          ],
        },
        {
          duration: THEME_TRANSITION.durationMs,
          easing: THEME_TRANSITION.easing,
          pseudoElement: "::view-transition-new(root)",
        }
      )
    })
  }

  // `d` toggles the mode. `l` moved to the language switcher in the nav.
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const el = e.target instanceof HTMLElement ? e.target : null
      if (el?.closest("input, textarea, select, [contenteditable='true']")) {
        return
      }
      if (e.key.toLowerCase() === "d") {
        pickMode(mode === "dark" ? "light" : "dark")
      }
    }
    window.addEventListener("keydown", onKeydown)
    return () => window.removeEventListener("keydown", onKeydown)
  })

  return (
    <div
      className="t-controls"
      // The reveal grows from wherever the control was clicked, so the origin
      // is captured before the click handler runs.
      onPointerDown={(e) => {
        const btn = (e.target as HTMLElement).closest("button")
        if (btn) {
          const r = btn.getBoundingClientRect()
          pointer.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
        } else {
          pointer.current = { x: e.clientX, y: e.clientY }
        }
      }}
    >
      {revealOverlay}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center">
              <PillGroup options={FLAGS} active={flag} onPick={pickFlag} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            {tTip("theme")}
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" decorative={false} className="h-3" />

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center">
              <PillGroup options={MODES} active={mode} onPick={pickMode} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            {tTip("mode")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
