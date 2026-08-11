"use client"

import { usePathname as useIntlPathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { NavLink } from "@/components/atoms/nav-link"
import { RollingText } from "@/components/atoms/rolling-text"

/** /projects/<slug>, but not /projects itself. */
const PROJECT_DETAIL = /^\/projects\/.+/

/** Brand and page links. */
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

  const backHref = isProjectDetail ? ("/projects" as const) : ("/" as const)

  return (
    <header className="relative z-10 w-full bg-background">
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
              <span className="sr-only sm:not-sr-only">{t("back")}</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
