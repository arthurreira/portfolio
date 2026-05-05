"use client"
import Link from "next/link"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { buttonVariants } from "@arthurreira/ui/components/button"
import { cn } from "@arthurreira/ui/lib/utils"
import type { BackLinkProps } from "./backLinkProps"

export function BackLink({ href = "/", label = "Back", className }: BackLinkProps) {
  return (
    <Link
      href={href}
      aria-label={`Go back to ${label}`}
      className={cn(
        buttonVariants({ variant: "default", size: "lg" }),
        "self-start sm:self-center text-sm flex items-center gap-2 ms-auto",
        className
      )}
    >
      <ArrowLeftIcon size={32}   />
      
      <span className="hidden sm:inline">
        {label}
      </span>
    </Link>
  )
}
