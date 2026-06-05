"use client"
import * as React from "react"
import { useEffect, useState } from "react"
import { useMountedAfter } from "../hooks/useMountedAfter"
import { cn } from "../lib/utils"

interface NavBarProps {
  href: string
  label: string
  children: React.ReactNode
}

function NavLogo({ href, label }: { href: string; label: string }) {
  const [cursor, setCursor] = useState(true)

  // Blink cursor
  useEffect(() => {
    const t = setInterval(() => setCursor(v => !v), 530)
    return () => clearInterval(t)
  }, [])

  return (
    <a
      href={href}
      className="font-mono text-sm font-semibold text-foreground hover:text-primary transition-colors duration-150 tracking-tight"
      aria-label={label}
    >
      {label}
      <span
        className="inline-block w-[2px] h-[0.9em] bg-primary align-middle ml-[2px] transition-opacity duration-75"
        style={{ opacity: cursor ? 1 : 0 }}
        aria-hidden
      />
    </a>
  )
}

export function NavBar({ href, label, children }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const mounted = useMountedAfter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      "w-full sticky top-0 z-50 transition-all duration-300",
      scrolled
        ? "border-b border-border/40 bg-background/80 backdrop-blur-sm h-12"
        : "border-transparent bg-transparent h-16"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-4 flex h-full items-center justify-between">
        {mounted && <NavLogo href={href} label={label} />}
        {!mounted && (
          <span className="font-mono text-sm font-semibold text-foreground tracking-tight">
            {label}
          </span>
        )}
        <nav className="flex items-center gap-3">{children}</nav>
      </div>
    </header>
  )
}
