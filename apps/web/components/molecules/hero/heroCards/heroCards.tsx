import { cn } from "@arthurreira/ui/lib/utils"
import { HeroCardsProps } from "./heroCardsProps"
import { HeroCard } from "@/components/atoms/hero"

export function HeroCards({ cards, className }: HeroCardsProps & { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", className)}>
      {cards.map((card, index) => (
        <HeroCard key={index} {...card} />
      ))}
    </div>
  )
}
