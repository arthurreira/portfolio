import { HeroCardsProps } from "./heroCardsProps"
import { HeroCard } from "@/components/atoms/hero"

export default function HeroCards({ cards }: HeroCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
  {cards.map((card, index) => (
    <HeroCard key={index} {...card} />
  ))}
</div>
  )
}
