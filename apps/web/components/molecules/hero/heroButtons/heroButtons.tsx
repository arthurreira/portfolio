"use client"
import { cn } from "@arthurreira/ui/lib/utils"
import { HeroButtonsProps } from "./heroButtonsProps"
import { HeroButton } from "@/components/atoms/hero"
import { useMountedAfter } from "@arthurreira/ui/hooks/useMountedAfter"

export function HeroButtons({ buttons, className }: HeroButtonsProps & { className?: string }) {
    const mounted = useMountedAfter()
  
  return (
    <div className={cn("flex justify-start gap-2", className)}>
      {buttons.map((button, index) => (
        <HeroButton
          key={index}
          {...button}
          mounted={mounted}
          delay={index * 0.1}  // 0s, 0.1s, 0.2s — staggers each button
        />
      ))}
    </div>
  )
}