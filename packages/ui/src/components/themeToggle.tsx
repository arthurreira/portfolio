"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@phosphor-icons/react"
import { Button } from "./button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <SunIcon size={16} weight="fill" className="dark:hidden" />
      <MoonIcon size={16} weight="fill" className="hidden dark:block" />
    </Button>
  )
}
