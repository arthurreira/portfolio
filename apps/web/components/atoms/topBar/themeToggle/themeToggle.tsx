"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@phosphor-icons/react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      <SunIcon size={16} weight="fill" className="dark:hidden" />
      <MoonIcon size={16} weight="fill" className="hidden dark:block" />
    </button>
  )
}
