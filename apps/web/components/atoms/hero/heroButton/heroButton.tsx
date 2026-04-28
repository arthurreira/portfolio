'use client'
import { HeroButtonProps } from "./heroButtonProps"
import Link from "next/link"
import { buttonVariants } from "@arthurreira/ui/components/button"
import { cn } from "@arthurreira/ui/lib/utils"
import { ArrowRightIcon } from "@phosphor-icons/react"

export default function HeroButton({ href, label, variant }: HeroButtonProps) {
  return (
    <Link href={href} className={cn(
      buttonVariants({ variant, size: "lg" }),
      "shadow-sm uppercase tracking-wider group"
    )}>
      {label} 
      <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}