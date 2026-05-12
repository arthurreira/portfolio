"use client"

import { useRouter, usePathname, Locale, routing } from "@/i18n/routing"
import { useLocale } from 'next-intl'
import { Button, cn } from "@arthurreira/ui"

const labels: Record<Locale, string> = {
  en: "EN",
  fi: "FI",
  "pt-br": "PT",
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  function switchLocale(locale: Locale) {
    router.push(pathname, { locale })
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((locale) => (
        <Button
          key={locale}
          variant="ghost"
          size="xs"
          onClick={() => switchLocale(locale)}
          aria-pressed={locale === currentLocale}
          className={cn(locale !== currentLocale && "text-muted-foreground")}
        >
          {labels[locale]}
        </Button>
      ))}
    </div>
  )
}
