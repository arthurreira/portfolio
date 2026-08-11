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
 * page, so it swaps the list for a single way back: to /projects from a
 * project, to / from anywhere else.
 */
export function SiteNav() {
  const intlPathname = useIntlPathname()
  const t = useTranslations("nav")
  const tProject = useTranslations("project")

  const isHome = intlPathname === "/"
  const isProjectDetail = PROJECT_DETAIL.test(intlPathname)

  const NAV_LINKS = [
    { href: "/projects", label: t("projects") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]

  // A project belongs to the list it came from; everything else belongs to
  // the home page.
  const back = isProjectDetail
    ? { href: "/projects" as const, label: tProject("back") }
    : { href: "/" as const, label: t("back") }

  return (
    <header className="relative z-10 w-full bg-background">
      <div className="t-nav">
        <NavLink
          href="/"
          className="t-brand shrink-0 text-lg font-bold tracking-[-0.02em]"
        >
          <RollingText text="arthurreira.dev" />
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
            <NavLink href={back.href} className="inline-flex items-center gap-2">
              <ArrowLeftIcon weight="bold" className="size-4" />
              {/* sr-only rather than hidden: below sm the arrow stands alone
                  visually, but the label stays in the accessibility tree, so
                  the link never degrades to an unnamed icon. */}
              <span className="sr-only sm:not-sr-only">{back.label}</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
