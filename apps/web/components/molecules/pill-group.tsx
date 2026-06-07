"use client"

import type { ReactNode } from "react"

import { PillButton } from "@/components/atoms/pill-button"
import { cn } from "@arthurreira/ui"

interface Option {
  key: string
  label: ReactNode
  /** Accessible name — required when `label` is an icon rather than text. */
  ariaLabel?: string
}

interface PillGroupProps {
  options: Option[]
  active: string
  onPick: (key: string) => void
  className?: string
}

export function PillGroup({ options, active, onPick, className }: PillGroupProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {options.map(({ key, label, ariaLabel }) => (
        <PillButton
          key={key}
          active={active === key}
          aria-label={ariaLabel}
          title={ariaLabel}
          onClick={() => onPick(key)}
        >
          {label}
        </PillButton>
      ))}
    </div>
  )
}
