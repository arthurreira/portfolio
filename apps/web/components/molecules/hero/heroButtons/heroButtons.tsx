import { cn } from "@arthurreira/ui/lib/utils"
import { HeroButtonsProps } from "./heroButtonsProps"
import { HeroButton } from "@/components/atoms/hero"

export function HeroButtons({ buttons, className }: HeroButtonsProps & { className?: string }) {
  return (
    <div className={cn("flex justify-start gap-2", className)}>
      {buttons.map((button, index) => (
        <HeroButton key={index} {...button} />
      ))}
    </div>
  )
}
