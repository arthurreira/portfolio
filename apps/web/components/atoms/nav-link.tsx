import { ComponentProps } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@arthurreira/ui"

type LinkHref = ComponentProps<typeof Link>["href"]

interface NavLinkProps {
  href: LinkHref
  active?: boolean
  children: React.ReactNode
  className?: string
}

// Uses next-intl's Link so hrefs are automatically prefixed with the current locale.
// Plain next/link with localePrefix:'always' would always navigate to the default locale.
export function NavLink({ href, active, children, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-ui text-base transition-colors duration-150",
        active
          ? "text-primary font-medium"
          : "text-foreground hover:text-primary font-normal",
        className
      )}
    >
      {children}
    </Link>
  )
}
