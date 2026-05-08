import Link from "next/link"
import { LanguageSwitcher } from "@/components/atoms/topBar"
import { TopBarProps } from "./topBarProps"
import { getTranslations } from 'next-intl/server'
import { ThemeToggle } from "@arthurreira/ui/components/themeToggle"
import { NavBar } from "@arthurreira/ui/components/navbar"
type NavItem = {
  label: string
  href: string
}


export async function TopBar({ locale }: TopBarProps) {
  const t = await getTranslations("topBar")
  
  
 
  return (
    <NavBar href="/" label="arthurreira.dev">

      
      <LanguageSwitcher />
      <ThemeToggle />
    </NavBar>
)}

