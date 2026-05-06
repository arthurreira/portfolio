"use client"
import { HeroStatProps } from "./heroStatProps"
import { ClockIcon, CodeIcon, TranslateIcon } from "@phosphor-icons/react"
import { Badge } from "@arthurreira/ui/components/badge"
import { cn } from "@arthurreira/ui/lib/utils"

const icons = {
  clock: ClockIcon,
  code: CodeIcon,
  translate: TranslateIcon,
}

export function HeroStat({ number, label, icon, visible, className }: HeroStatProps & { visible: boolean; className?: string }) {
  const IconComponent = icons[icon as keyof typeof icons]

  return (
    <div data-slot="hero-stat" className={cn("flex items-center gap-1 sm:gap-4", className)}>
      <div className="relative">
        {IconComponent && <IconComponent  size={22} weight="duotone" className="text-primary" />}
        <Badge className={cn(
          "absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300",
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
        )}>
          {label}
        </Badge>
      </div>
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{number}</h2>
      </div>
    </div>
  )
}
