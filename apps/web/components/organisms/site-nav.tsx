"use client"

import { useState, useEffect, useRef } from "react"
import { flushSync } from "react-dom"
import { useRouter, usePathname as useIntlPathname, routing } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Sun, Moon } from "@phosphor-icons/react/ssr"
import { NavLink } from "@/components/atoms/nav-link"
import { RollingText } from "@/components/atoms/rolling-text"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arthurreira/ui/components/tooltip"
import { PillGroup } from "@/components/molecules/pill-group"
import { useCircleReveal } from "@/components/molecules/circle-reveal"
import { FlagFill, FlagPillFill } from "@/components/atoms/flag-icons"
import { THEME_TRANSITION } from "@/lib/theme-transition"

// Full-bleed flags: no padding box, dimmed when inactive, accent border when
// active (via aria-pressed set by PillButton).
const FLAG_PILL_CLASS =
  "overflow-hidden p-0 opacity-60 saturate-50 transition-all hover:opacity-100 aria-pressed:border-primary aria-pressed:opacity-100 aria-pressed:saturate-100"

const FLAGS = [
  { key: "brasil", label: <FlagPillFill flag="brasil" />, ariaLabel: "Brasil", className: FLAG_PILL_CLASS },
  { key: "suomi",  label: <FlagPillFill flag="suomi"  />, ariaLabel: "Suomi",  className: FLAG_PILL_CLASS },
]
const LANGS = [
  { key: "en",    label: "EN" },
  { key: "fi",    label: "FI" },
  { key: "pt-br", label: "PT" },
]

function setAxis(attr: string, storageKey: string, value: string) {
  document.documentElement.setAttribute(`data-${attr}`, value)
  try {
    localStorage.setItem(storageKey, value)
    // Cookie so the server can read it on next navigation (no flash).
    // Secure only over HTTPS so local http dev still stores the cookie.
    const secure = location.protocol === "https:" ? ";Secure" : ""
    document.cookie = `${storageKey}=${value};path=/;max-age=31536000;SameSite=Lax${secure}`
  } catch {
    /* storage unavailable (private mode) — DOM attribute already applied */
  }
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> }
}

export function SiteNav() {
  const router        = useRouter()
  const intlPathname  = useIntlPathname() // path without locale prefix, e.g. /projects
  const currentLocale = useLocale()
  const t             = useTranslations("nav")
  const tTheme        = useTranslations("theme")
  const tTip          = useTranslations("tooltips")

  const MODES = [
    { key: "dark",  label: <Moon weight="fill" />, ariaLabel: tTheme("dark")  },
    { key: "light", label: <Sun weight="fill" />,  ariaLabel: tTheme("light") },
  ]

  const NAV_LINKS = [
    { href: "/projects", label: t("projects") },
    { href: "/about",    label: t("about")    },
    { href: "/contact",  label: t("contact")  },
  ]

  const [flag, setFlag] = useState("brasil")
  const [mode, setMode] = useState("dark")
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const { overlay: revealOverlay, run: runReveal } = useCircleReveal()

  function originFromPointer() {
    return pointer.current ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
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
    runReveal(<FlagFill flag={val} />, originFromPointer(), () => applyFlag(val))
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
      Math.max(o.y, window.innerHeight - o.y),
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
        },
      )
    })
  }

  function pickLocale(locale: string) {
    if (locale === currentLocale) return
    // No full-screen reveal here — the pill's own active-state transition is the
    // only animation on a language change.
    router.push(intlPathname, { locale: locale as (typeof routing.locales)[number] })
  }

  // Keyboard shortcuts promised by the top-bar hints: d toggles the mode
  // (with the view-transition sweep), l cycles the language. Re-subscribes per
  // render so the handlers always see current state; listeners are cheap.
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const el = e.target instanceof HTMLElement ? e.target : null
      if (el?.closest("input, textarea, select, [contenteditable='true']")) return

      const key = e.key.toLowerCase()
      if (key === "d") {
        pickMode(mode === "dark" ? "light" : "dark")
      } else if (key === "l") {
        const idx = LANGS.findIndex((lang) => lang.key === currentLocale)
        const next = LANGS[(idx + 1) % LANGS.length]
        if (next) pickLocale(next.key)
      }
    }
    window.addEventListener("keydown", onKeydown)
    return () => window.removeEventListener("keydown", onKeydown)
  })

  return (
    <header
      className="w-full bg-background"
      style={{ position: "relative", zIndex: 10 }}
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
      <div className="t-nav">
        {/* Left — logo. Breaks out to the viewport corner above 75rem; see
            .t-brand. Positioned against the <header>, which owns the relative
            context, not against the centred .t-nav. */}
        <NavLink
          href="/"
          className="t-brand shrink-0 text-lg font-bold tracking-[-0.02em]"
        >
          <RollingText text="arthurreira.dev" />
        </NavLink>

        {/* Right — page links */}
        <nav className="t-links">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href} active={intlPathname.startsWith(href)}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Controls row (drops to own row on ≤900px) */}
        <div className="t-controls">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center">
                  <PillGroup options={FLAGS} active={flag} onPick={pickFlag} />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {tTip("theme")}
              </TooltipContent>
            </Tooltip>

            <span className="h-3 w-px bg-border" />

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center">
                  <PillGroup options={MODES} active={mode} onPick={pickMode} />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {tTip("mode")}
              </TooltipContent>
            </Tooltip>

            <span className="h-3 w-px bg-border" />

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center">
                  <PillGroup options={LANGS} active={currentLocale} onPick={pickLocale} />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {tTip("language")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}
