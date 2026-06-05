import Link from "next/link"
import { NavBar, ThemeToggle } from "@arthurreira/ui/client"

const NAV_ITEMS = [
  { label: "sortable",      href: "/sortable" },
  { label: "cards",         href: "/cards" },
  { label: "number-reveal", href: "/number-reveal" },
  { label: "sdk-test",      href: "/sdk-test" },
]

export function TopBar() {
  return (
    <NavBar href="/" label="arthurreira.dev/playground">
      <div className="hidden sm:flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-mono text-xs text-muted-foreground/60 hover:text-foreground px-2 py-1 transition-colors duration-150 uppercase tracking-wider"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </NavBar>
  )
}
