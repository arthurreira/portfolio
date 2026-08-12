"use client"

import { useEffect } from "react"
import {
  useRouter,
  usePathname as useIntlPathname,
  routing,
} from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arthurreira/ui/components/tooltip"
import { PillGroup } from "@/components/molecules/pill-group"

const LANGS = [
  { key: "en", label: "EN" },
  { key: "fi", label: "FI" },
  { key: "pt-br", label: "PT" },
]

/**
 * Lives in the nav, not the footer, because defaultLocale is 'fi': a visitor
 * who does not read Finnish lands on Finnish, and the way out has to be
 * visible without scrolling. Theme and mode stayed in the footer — those are
 * preferences nobody leaves over.
 */
export function LanguageSwitcher() {
  const router = useRouter()
  const intlPathname = useIntlPathname()
  const currentLocale = useLocale()
  const tTip = useTranslations("tooltips")

  function pickLocale(locale: string) {
    if (locale === currentLocale) return
    // No full-screen reveal here — the pill's own active-state transition is
    // the only animation on a language change.
    router.push(intlPathname, {
      locale: locale as (typeof routing.locales)[number],
    })
  }

  // `l` cycles the language. Moved here with the control it drives; `d` stayed
  // with the mode switcher in the footer.
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const el = e.target instanceof HTMLElement ? e.target : null
      if (el?.closest("input, textarea, select, [contenteditable='true']")) {
        return
      }
      if (e.key.toLowerCase() !== "l") return

      const idx = LANGS.findIndex((lang) => lang.key === currentLocale)
      const next = LANGS[(idx + 1) % LANGS.length]
      if (next) pickLocale(next.key)
    }
    window.addEventListener("keydown", onKeydown)
    return () => window.removeEventListener("keydown", onKeydown)
  })

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center">
            <PillGroup
              options={LANGS}
              active={currentLocale}
              onPick={pickLocale}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          {tTip("language")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
