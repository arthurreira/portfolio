"use client"

import type { RefObject } from "react"
import { useState } from "react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"
import { cn } from "@arthurreira/ui"

import { TURNSTILE_SITE_KEY } from "@/hooks/use-turnstile"

/**
 * Turnstile's language codes are not our locale keys — `pt-br` has to be sent
 * as `pt-BR` or the widget falls back to English.
 */
const TURNSTILE_LANGUAGES: Record<string, string> = {
  en: "en",
  fi: "fi",
  "pt-br": "pt-BR",
}

interface ChatTurnstileProps {
  widgetRef: RefObject<TurnstileInstance | null>
}

/**
 * The bot check, sized and themed to sit inside the chat panel.
 *
 * Most visitors never see this: in `interaction-only` appearance the widget
 * renders nothing and contributes no height until Cloudflare decides it needs
 * a human. The border and padding are therefore applied only while a challenge
 * is actually on screen — otherwise the panel would carry an empty strip above
 * the composer for everyone.
 *
 * Height is deliberately *not* forced to zero in the idle state. Clipping the
 * widget ourselves risks hiding a challenge in the window between Cloudflare
 * showing it and our state catching up, and a challenge nobody can see is a
 * chat nobody can use.
 */
export function ChatTurnstile({ widgetRef }: ChatTurnstileProps) {
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const [isInteractive, setIsInteractive] = useState(false)

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <div
      className={cn(
        "shrink-0",
        isInteractive && "flex justify-center border-t px-4 py-3"
      )}
    >
      <Turnstile
        ref={widgetRef}
        siteKey={TURNSTILE_SITE_KEY}
        onBeforeInteractive={() => setIsInteractive(true)}
        onAfterInteractive={() => setIsInteractive(false)}
        onError={() => setIsInteractive(false)}
        options={{
          execution: "execute",
          appearance: "interaction-only",
          // The default is a fixed 300px box, which overflows the panel on a
          // narrow phone. Flexible fills the available width instead.
          size: "flexible",
          // `auto` follows the OS preference, which is wrong here — the site
          // has its own theme toggle and the two routinely disagree.
          theme: resolvedTheme === "dark" ? "dark" : "light",
          language: TURNSTILE_LANGUAGES[locale] ?? "auto",
        }}
      />
    </div>
  )
}
