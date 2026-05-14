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
        ? "border-b bg-background/80 backdrop-blur-sm h-12"
        : "border-transparent bg-transparent h-16"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-4 flex h-14 items-center justify-between">
        <a
          href={href}
          data-loaded={mounted}
          className="nav-logo scroll-m-20 font-extrabold tracking-tight text-balance"
        >
          {label}
        </a>
        <nav className="flex items-center gap-3">{children}</nav>
      </div>
    </header>
  )
}