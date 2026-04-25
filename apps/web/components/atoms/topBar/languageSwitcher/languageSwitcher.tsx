"use client"

import { useRouter, usePathname } from "next/navigation"
import { routing, Locale } from "@/i18n/routing"

const labels: Record<Locale, string> = {
  en: "EN",
  fi: "FI",
  "pt-br": "PT",
}

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(locale: Locale) {
    // Replace the locale prefix in the pathname
    const segments = pathname.split("/")
    segments[1] = locale
    router.push(segments.join("/"))
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`text-xs font-medium px-1.5 py-0.5 rounded transition-colors ${
            locale === currentLocale
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  )
}
