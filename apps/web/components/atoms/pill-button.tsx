"use client"

import { ButtonHTMLAttributes } from "react"
import { cn } from "@arthurreira/ui"

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function PillButton({ active, className, children, ...props }: PillButtonProps) {
  return (
    <button
      className={cn(
        "font-ui text-[10px] tracking-[0.15em] uppercase px-2 py-[3px]",
        "border transition-all duration-150 cursor-pointer",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
