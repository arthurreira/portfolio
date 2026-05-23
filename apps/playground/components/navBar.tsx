import Link from "next/link"
import { NavBar, ThemeToggle } from "@arthurreira/ui/client"
type NavItem = {
  label: string
  href: string
}


export function TopBar() {


  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Sortable", href: "/sortable" },
    { label: "Cards", href: "/cards" },
    { label: "Number Reveal", href: "/number-reveal" },
  ]
  return (
    <NavBar href="/" label="arthurreira.dev - Playground">


      <div className="flex flex-row justify-center items-center gap-4 ">
        {navItems.map((item) => (
          <Link key={item.href} className="" href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>


      <ThemeToggle />


    </NavBar>
  )
}
