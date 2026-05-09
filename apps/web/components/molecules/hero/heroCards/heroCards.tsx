"use client"
import { cn } from "@arthurreira/ui/lib/utils"
import { HeroCardsProps } from "./heroCardsProps"
import { HeroCard } from "@/components/atoms/hero"
import { useMountedAfter } from "@arthurreira/ui/hooks/useMountedAfter"

export function HeroCards({ cards, className }: HeroCardsProps & { className?: string }) {
  const mounted = useMountedAfter()
  return (
    <div className={cn("grid grid-cols-1 gap-3", className)}>
      {cards.map((card, index) => (
        <HeroCard key={index} {...card} mounted={mounted} index={index} />
      ))}
    </div>
  )
}
