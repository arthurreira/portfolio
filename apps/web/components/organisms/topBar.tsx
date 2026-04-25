import Link from "next/link"
import { LanguageSwitcher, ThemeToggle } from "@/components/atoms/topBar"
import { Locale } from "@/i18n/routing"

export default function TopBar({ locale }: { locale: Locale }) {
  return (
    <header className="w-full border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 flex h-14 items-center justify-between">
        <Link href="/" className="text-sm font-medium">
          arthurreira.dev
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
          
        </div>
      </div>
    </header>
  )
}
