import { Link } from "@/i18n/routing"
import { cn } from "@arthurreira/ui"

interface NavLinkProps {
  href: string
  active?: boolean
  children: React.ReactNode
  className?: string
}

// Uses next-intl's Link so hrefs are automatically prefixed with the current locale.
// Plain next/link with localePrefix:'always' would always navigate to the default locale.
export function NavLink({ href, active, children, className }: NavLinkProps) {
  return (
    <Link
      href={href as any}
      className={cn(
        "font-ui text-sm transition-colors duration-150",
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
