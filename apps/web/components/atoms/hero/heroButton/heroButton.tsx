'use client'
import { HeroButtonProps } from "./heroButtonProps"
import Link from "next/link"
import { buttonVariants } from "@arthurreira/ui/components/button"
import { cn } from "@arthurreira/ui/lib/utils"
import { ArrowRightIcon } from "@phosphor-icons/react"

export function HeroButton({
  href,
  label,
  variant,
  mounted,
  delay = 0,
  className
}: HeroButtonProps & { mounted?: boolean; delay?: number; className?: string }) {
  return (
    <Link
      href={href}
      data-slot="hero-button"
      data-mounted={mounted}
      style={{ transitionDelay: `${delay}s` }}
      className={cn(
        "hero-button",
        buttonVariants({ variant, size: "lg" }),
        "shadow-sm uppercase tracking-wider group",
        className
      )}
    >
      {label}
      <ArrowRightIcon size={22} weight="thin" className="group-hover:translate-x-1 transition-transform text-primary hover:text-primary-foreground" />
    </Link>
  )
}