"use client"

import { useState, useEffect, useRef } from "react"
import { flushSync } from "react-dom"
import { useRouter, usePathname as useIntlPathname, routing } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { NavLink } from "@/components/atoms/nav-link"
import { PillGroup } from "@/components/molecules/pill-group"

const FLAGS = [
  { key: "brasil", label: "Brasil" },
  { key: "suomi",  label: "Suomi"  },
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
    // Cookie so the server can read it on next navigation (no flash)
    document.cookie = `${storageKey}=${value};path=/;max-age=31536000;SameSite=Lax`
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

  const MODES = [
    { key: "dark",  label: tTheme("dark")  },
    { key: "light", label: tTheme("light") },
  ]

  const NAV_LINKS = [
    { href: "/projects", label: t("projects") },
    { href: "/about",    label: t("about")    },
    { href: "/contact",  label: t("contact")  },
  ]

  const [flag, setFlag] = useState("brasil")
  const [mode, setMode] = useState("dark")
  const pointer = useRef<{ x: number; y: number } | null>(null)

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

  // Sync button highlight when the boot-script keyboard handler fires
  useEffect(() => {
    function onTheme(e: Event) {
      const detail = (e as CustomEvent).detail ?? {}
      flushSync(() => {
        if (detail.mode) setMode(detail.mode)
        if (detail.flag) setFlag(detail.flag)
      })
    }
    window.addEventListener("arthur-theme", onTheme)
    return () => window.removeEventListener("arthur-theme", onTheme)
  }, [])

  function pickFlag(val: string) {
    setAxis("flag", "arthur-flag", val)
    flushSync(() => setFlag(val))
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
        { duration: 500, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
      )
    })
  }

  function pickLocale(locale: string) {
    router.push(intlPathname, { locale: locale as (typeof routing.locales)[number] })
  }

  return (
    <header
      className="w-full border-b border-hairline bg-background font-ui"
      style={{ position: "relative", zIndex: 10 }}
      onPointerDown={(e) => { pointer.current = { x: e.clientX, y: e.clientY } }}
    >
      <div className="t-nav">
        {/* Left — logo */}
        <NavLink href="/" className="shrink-0 font-bold tracking-[-0.01em]">
          arthurreira.dev
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
          <PillGroup options={FLAGS} active={flag} onPick={pickFlag} />
          <span className="h-3 w-px bg-border" />
          <PillGroup options={MODES} active={mode} onPick={pickMode} />
          <span className="h-3 w-px bg-border" />
          <PillGroup options={LANGS} active={currentLocale} onPick={pickLocale} />
        </div>
      </div>
    </header>
  )
}
