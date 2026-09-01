"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname as useIntlPathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowLeftIcon, ChatCircleIcon } from "@phosphor-icons/react"
import { cn } from "@arthurreira/ui"
import { Separator } from "@arthurreira/ui/client"
import { NavLink } from "@/components/atoms/nav-link"
import { RollingText } from "@/components/atoms/rolling-text"
import { LanguageSwitcher } from "@/components/molecules/language-switcher"
import {
  CHAT_CLOSED_EVENT,
  OPEN_CHAT_EVENT,
} from "@/components/features/chat/chat-events"

/** /projects/<slug>, but not /projects itself. */
const PROJECT_DETAIL = /^\/projects\/.+/

/** How far down the page the nav condenses. */
const CONDENSE_AT = 50

/** Brand, page links, language, and the chat trigger. */
export function SiteNav() {
  const intlPathname = useIntlPathname()
  const t = useTranslations("nav")
  const tChat = useTranslations("chat")

  const [condensed, setCondensed] = useState(false)
  const chatTriggerRef = useRef<HTMLButtonElement>(null)
  // Only the button that opened the panel takes focus back when it closes —
  // otherwise closing a panel opened from the home page's CTA would yank focus
  // up to the nav.
  const openedFromNav = useRef(false)

  const isHome = intlPathname === "/"
  const isProjectDetail = PROJECT_DETAIL.test(intlPathname)

  const NAV_LINKS = [
    { href: "/projects", label: t("projects") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]

  const backHref = isProjectDetail ? ("/projects" as const) : ("/" as const)

  // Lenis scrolls the window in root mode, so scrollY and position:sticky both
  // behave normally here.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > CONDENSE_AT)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onClosed = () => {
      if (!openedFromNav.current) return
      openedFromNav.current = false
      chatTriggerRef.current?.focus()
    }
    window.addEventListener(CHAT_CLOSED_EVENT, onClosed)
    return () => window.removeEventListener(CHAT_CLOSED_EVENT, onClosed)
  }, [])

  function openChat() {
    openedFromNav.current = true
    window.dispatchEvent(new Event(OPEN_CHAT_EVENT))
  }

  return (
    <header
      // Opaque, not translucent: a half-transparent bar over the hero at 88px
      // leaves the type ghosting through it.
      className="sticky top-0 z-50 w-full bg-background transition-[border-color] duration-200"
      data-condensed={condensed}
      style={{
        borderBottom: `1px solid ${condensed ? "var(--border)" : "transparent"}`,
      }}
    >
      <div className="t-nav">
        <NavLink
          href="/"
          aria-label="arthurreira.dev"
          className="t-brand shrink-0 text-lg font-bold tracking-[-0.02em]"
        >
          <span aria-hidden className="sm:hidden">
            AF
          </span>
          <span aria-hidden className="hidden sm:inline">
            <RollingText text="arthurreira.dev" />
          </span>
        </NavLink>

        <nav className="t-links">
          {/* The arrow and the page links are the same slot at two widths, not
              two features. Off home, mobile has room for one thing and it is
              the way back; from sm up the row has room for the real links, so
              they carry the navigation and the arrow steps aside. */}
          {!isHome && (
            <NavLink
              href={backHref}
              className="inline-flex items-center gap-2 sm:hidden"
            >
              <ArrowLeftIcon weight="bold" className="size-4" />
              <span className="sr-only sm:not-sr-only">{t("back")}</span>
            </NavLink>
          )}

          {/* Not on a project detail page: that page carries its own
              "Back to Projects" above the title from sm up, and the full link
              row beside it is one navigation too many. */}
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              active={intlPathname.startsWith(href)}
              className={cn(
                isProjectDetail ? "hidden" : !isHome && "hidden sm:inline-flex"
              )}
            >
              {label}
            </NavLink>
          ))}

          {/* The chat used to be a floating button in the corner, competing
              with the closing CTA for the same attention. It is a way into the
              site's content, so it belongs with the other ways in. */}
          {/* A hairline, not a gap. The chat is a different kind of thing from
              the page links, and the Alignment chapter's thin vertical rule
              says that far more quietly than more spacing would.
              It needs something on its left: on a project page from sm up
              both the arrow and the links are gone, and the rule would lead
              the row on its own. */}
          <Separator
            orientation="vertical"
            decorative
            className={cn("h-3 shrink-0", isProjectDetail && "sm:hidden")}
          />

          <button
            ref={chatTriggerRef}
            type="button"
            onClick={openChat}
            title={tChat("openHint")}
            // Short in the row, full name to assistive tech. The row is capped
            // at the page column (44rem), not the viewport — "Ask about Arthur"
            // spelled out was enough on its own to overflow it.
            aria-label={tChat("open")}
            // The accent earns its place here: this is the back-up CTA, and the
            // nav is the only chrome it now lives in.
            className="inline-flex shrink-0 items-center gap-1.5 text-base font-normal text-primary transition-opacity duration-150 hover:opacity-70"
          >
            <ChatCircleIcon weight="bold" className="size-4 sm:hidden" />
            <span className="sr-only sm:not-sr-only">{t("ask")}</span>
          </button>

          {/* Last in the row, after the links: it is a way out of a page you
              cannot read, not a destination alongside them. */}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
