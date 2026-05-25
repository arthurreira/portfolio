"use client"
import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { LanguageSwitcher } from "@/components/atoms/topBar"
import { NavBar, ThemeToggle } from "@arthurreira/ui/client"
import { ViewerCount } from "@/components/atoms/viewerCount/viewerCount"


export function TopBar() {



  return (
    <NavBar href="/" label="arthurreira.dev">
      <ViewerCount />

      <LanguageSwitcher />
      <ThemeToggle />
      <Link
        href="https://github.com/arthurreira"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-accent-foreground hover:underline underline-offset-4 transition-colors"
      >
        <GithubLogoIcon size={22} weight="thin" className="text-primary hover:text-primary-foreground" />

      </Link>
    </NavBar>
  )
}

