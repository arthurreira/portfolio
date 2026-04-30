"use client"
import { HeroCardProps } from "./heroCardProps"
import { Card } from "@arthurreira/ui/components/card"
import { cn } from "@arthurreira/ui/lib/utils"
import { BriefcaseMetalIcon, MapPinSimpleIcon, RocketLaunchIcon } from "@phosphor-icons/react"

const icons = {
  mapPin: MapPinSimpleIcon,
  briefcase: BriefcaseMetalIcon,
  rocket: RocketLaunchIcon,
}

export function HeroCard({ title, description, icon, className }: HeroCardProps & { className?: string }) {
  const IconComponent = icons[icon]
  return (
    <Card data-slot="hero-card" className={cn("flex p-2 md:p-3 lg:p-4 hover:-translate-y-1 transition-transform duration-200 hover:shadow-lg", className)}>
      <div>
        <span className="min-w-max p-2 md:p-3 bg-accent dark:bg-accent text-secondary-foreground rounded-md flex items-start justify-start">
          {IconComponent && <IconComponent size={32} weight="duotone" className="text-yellow-400" />}
          <span className="font-semibold text-lg ms-3">
            {title}
          </span>
        </span>
        <p className="text-muted-foreground text-sm mt-2">
          {description}
        </p>
      </div>
    </Card>
  )
}
