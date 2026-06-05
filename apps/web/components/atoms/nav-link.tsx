import Link from "next/link"
import { cn } from "@arthurreira/ui"

interface NavLinkProps {
  href: string
  active?: boolean
  children: React.ReactNode
  className?: string
}

export function NavLink({ href, active, children, className }: NavLinkProps) {
  return (
    <Link
      href={href}
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
