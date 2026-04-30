'use client'
import { HeroButtonProps } from "./heroButtonProps"
import Link from "next/link"
import { buttonVariants } from "@arthurreira/ui/components/button"
import { cn } from "@arthurreira/ui/lib/utils"
import { ArrowRightIcon } from "@phosphor-icons/react"

export function HeroButton({ href, label, variant, className }: HeroButtonProps & { className?: string }) {
  return (
    <Link href={href} data-slot="hero-button" className={cn(
      buttonVariants({ variant, size: "lg" }),
      "shadow-sm uppercase tracking-wider group",
      className
    )}>
      {label}
      <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}
