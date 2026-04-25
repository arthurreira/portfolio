import { HeroCardsProps } from "./heroCardsProps"
import HeroCard from "@/components/atoms/hero/heroCard"

export default function HeroCards({ cards }: HeroCardsProps) {
  return (
    <div className="space-y-3 lg:space-y-6">
      {cards.map((card, index) => (
        <HeroCard key={index} {...card} />
      ))}
    </div>
  )
}
