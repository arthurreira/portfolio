"use client"
import { HeroCardProps } from "./heroCardProps"
import { Card } from "@arthurreira/ui/components/card"
import { BriefcaseMetalIcon, MapPinSimpleIcon, RocketLaunchIcon } from "@phosphor-icons/react"

const icons = {
  mapPin: MapPinSimpleIcon,
  briefcase: BriefcaseMetalIcon,
  rocket: RocketLaunchIcon,
}
export default function HeroCard({ title, description, icon }: HeroCardProps) {
    const IconComponent = icons[icon]
    return <Card className="flex items-start gap-x-2 p-2 md:p-3 lg:p-4 
  bg-card text-card-foreground 
  dark:bg-zinc-900 dark:border-zinc-800
  hover:translate-y-[-4px] transition-transform duration-200 
  shadow-md hover:shadow-lg border border-border">
    <span className="min-w-max p-2 md:p-3 bg-secondary dark:bg-zinc-800 text-secondary-foreground rounded-md flex items-center justify-center">
        {IconComponent && <IconComponent size={32} color="#fdc800" weight="duotone" className="hover:" />}
    </span>
    <div>
        <span className="font-semibold text-lg">
            {title}
        </span>
        <p className="text-muted-foreground">
            {description}
        </p>
    </div>
</Card>

}
