"use client"

import { useRouter, usePathname, Locale,routing } from "@/i18n/routing"
import { useLocale } from 'next-intl'
const labels: Record<Locale, string> = {
  en: "EN",
  fi: "FI",
  "pt-br": "PT",
}

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() // ← always fresh, client-side

  function switchLocale(locale: Locale) {
  router.push(pathname, { locale })
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
