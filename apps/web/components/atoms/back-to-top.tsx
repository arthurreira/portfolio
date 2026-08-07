"use client"

import { useState } from "react"
import { useLenis } from "lenis/react"
import { useTranslations } from "next-intl"
import { ArrowUp } from "@phosphor-icons/react/ssr"
import { cn } from "@arthurreira/ui"

/** Scroll distance (px) before the button fades in. */
const SHOW_AFTER_PX = 400

/**
 * Back-to-top button — appears after scrolling down and glides the page back
 * up via Lenis's `scrollTo`, so the jump uses the same easing as the rest of
 * the site. Must render inside `<ReactLenis>` to reach the instance.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations("nav")

  const lenis = useLenis((instance) => {
    setVisible(instance.scroll > SHOW_AFTER_PX)
  })

  return (
    <button
      type="button"
      aria-label={t("backToTop")}
      onClick={() => lenis?.scrollTo(0, { duration: 1.1 })}
      className={cn(
        "border-border bg-background/80 text-muted-foreground fixed right-5 bottom-20 z-50 flex size-10 items-center justify-center border backdrop-blur transition-all duration-300",
        "hover:border-primary hover:text-primary",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <ArrowUp weight="bold" className="size-4" />
    </button>
  )
}
