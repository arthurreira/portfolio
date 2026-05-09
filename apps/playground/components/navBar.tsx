import Link from "next/link"
import { ThemeToggle } from "@arthurreira/ui/components/themeToggle"
import { NavBar } from "@arthurreira/ui/components/navbar"
type NavItem = {
  label: string
  href: string
}


export function TopBar() {


  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Cards", href: "/cards" },
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

