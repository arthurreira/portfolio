"use client"

import { usePathname as useIntlPathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { NavLink } from "@/components/atoms/nav-link"
import { RollingText } from "@/components/atoms/rolling-text"

/** /projects/<slug>, but not /projects itself. */
const PROJECT_DETAIL = /^\/projects\/.+/

/**
 * Brand and page links. The theme, mode and language switchers used to live
 * here too and now sit in the footer — they are global controls rather than
 * navigation, and they were the densest thing in the top bar.
 *
 * Only the home page carries the link list. Every inner page is a reading
 * page, so it swaps the list for a single way back — one word, with the
 * destination reading as "up one level": /projects from a project, / from
 * anywhere else.
 */
export function SiteNav() {
  const intlPathname = useIntlPathname()
  const t = useTranslations("nav")

  const isHome = intlPathname === "/"
  const isProjectDetail = PROJECT_DETAIL.test(intlPathname)

  const NAV_LINKS = [
    { href: "/projects", label: t("projects") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]

  // One label everywhere — the destination is contextual, the word is not.
  // A project belongs to the list it came from; everything else belongs to
  // the home page.
  const backHref = isProjectDetail ? ("/projects" as const) : ("/" as const)

  return (
    <header className="relative z-10 w-full bg-background">
      <div className="t-nav">
        {/* Full wordmark from sm up, the AF monogram below it — the same mark
            as the favicon, but set in type so it follows all four themes and
            costs no image request. The wordmark plus a back link did not fit
            a phone, and hiding the brand outright is not an option now that
            inner pages carry no links: it is the only route home.
            aria-label so the accessible name is the wordmark at every width. */}
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
          {isHome ? (
            NAV_LINKS.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                active={intlPathname.startsWith(href)}
              >
                {label}
              </NavLink>
            ))
          ) : (
            <NavLink href={backHref} className="inline-flex items-center gap-2">
              <ArrowLeftIcon weight="bold" className="size-4" />
              {/* sr-only rather than hidden: below sm the arrow stands alone
                  visually, but the label stays in the accessibility tree, so
                  the link never degrades to an unnamed icon. */}
              <span className="sr-only sm:not-sr-only">{t("back")}</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
