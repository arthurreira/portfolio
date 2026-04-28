import Link from "next/link"
import { LanguageSwitcher, ThemeToggle } from "@/components/atoms/topBar"
import { TopBarProps } from "./topBarProps"

export default function TopBar({ locale }: TopBarProps) {
  return (
    <header className="w-full border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-4 flex h-14 items-center justify-between">
        <Link href="/" className="text-sm font-medium">
          arthurreira.dev
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher  />
          <ThemeToggle />
          
        </div>
      </div>
    </header>
  )
}
