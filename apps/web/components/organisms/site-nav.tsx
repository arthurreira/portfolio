"use client"

import { useState, useEffect } from "react"
import { flushSync } from "react-dom"
import { usePathname } from "next/navigation"
import { useRouter, usePathname as useIntlPathname, routing } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { NavLink } from "@/components/atoms/nav-link"
import { PillGroup } from "@/components/molecules/pill-group"

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/about",    label: "About"    },
  { href: "/contact",  label: "Contact"  },
]

const FLAGS = [
  { key: "brasil", label: "Brasil" },
  { key: "suomi",  label: "Suomi"  },
]
const MODES = [
  { key: "dark",  label: "Dark"  },
  { key: "light", label: "Light" },
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
    // Also set a cookie so the server can read it on next navigation (no flash)
    document.cookie = `${storageKey}=${value};path=/;max-age=31536000;SameSite=Lax`
  } catch {}
}

function LangSwitcher({
  active,
  onPick,
}: {
  active: string
  onPick: (locale: string) => void
}) {
  return <PillGroup options={LANGS} active={active} onPick={onPick} />
}

export function SiteNav() {
  const pathname        = usePathname()
  const router          = useRouter()
  const intlPathname    = useIntlPathname()
  const currentLocale   = useLocale()

  const [flag, setFlag] = useState("brasil")
  const [mode, setMode] = useState("dark")

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

  // Sync button highlight when boot-script keyboard handler fires
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
  function pickMode(val: string) {
    setAxis("mode", "arthur-mode", val)
    flushSync(() => setMode(val))
  }
  function pickLocale(locale: string) {
    router.push(intlPathname, { locale: locale as typeof routing.locales[number] })
  }

  return (
    <header className="w-full bg-background font-ui" style={{ position: "relative", zIndex: 10 }}>
      <div className="t-nav">
        {/* Left — logo */}
        <NavLink href="/" className="font-bold tracking-[-0.01em] shrink-0">
          arthurreira.dev
        </NavLink>

        {/* Right — page links */}
        <nav className="t-links">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href} active={pathname.includes(href)}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Controls row (drops to own row on ≤900px) */}
        <div className="t-controls">
          <PillGroup options={FLAGS} active={flag} onPick={pickFlag} />
          <span className="w-px h-3 bg-border" />
          <PillGroup options={MODES} active={mode} onPick={pickMode} />
          <span className="w-px h-3 bg-border" />
          <LangSwitcher active={currentLocale} onPick={pickLocale} />
        </div>
      </div>

      {/* Hairline — starts after ticker strip */}
      <div className="t-hairline" />
    </header>
  )
}
