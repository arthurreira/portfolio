"use client"

import type { RefObject } from "react"
import { useState } from "react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"
import { cn } from "@arthurreira/ui"

import { TURNSTILE_SITE_KEY } from "@/hooks/use-turnstile"

// Turnstile wants lowercase language codes, which our locales already are —
// sending `pt-BR` gets a console warning and a fallback to `pt-br`.

interface ChatTurnstileProps {
  widgetRef: RefObject<TurnstileInstance | null>
}

/** The bot check, sized and themed to sit inside the chat panel. */
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
          language: locale,
        }}
      />
    </div>
  )
}
