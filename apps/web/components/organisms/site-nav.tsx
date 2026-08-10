"use client"

import { usePathname as useIntlPathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { NavLink } from "@/components/atoms/nav-link"
import { RollingText } from "@/components/atoms/rolling-text"

/**
 * Brand and page links. The theme, mode and language switchers used to live
 * here too and now sit in the footer — they are global controls rather than
 * navigation, and they were the densest thing in the top bar.
 */
export function SiteNav() {
  const intlPathname = useIntlPathname()
  const t = useTranslations("nav")

  const NAV_LINKS = [
    { href: "/projects", label: t("projects") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]

  return (
    <header className="relative z-10 w-full bg-background">
      <div className="t-nav">
        {/* Logo — lifted out of the row into the viewport corner by .t-brand,
            so the links below can start on the page's own left edge. */}
        <NavLink
          href="/"
          className="t-brand shrink-0 text-lg font-bold tracking-[-0.02em]"
        >
          <RollingText text="arthurreira.dev" />
        </NavLink>

        <nav className="t-links">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              active={intlPathname.startsWith(href)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
