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
    return (
    <Card className="flex  g p-2 md:p-3 lg:p-4   hover:translate-y-[-4px] transition-transform duration-200  hover:shadow-lg">
        <div>
            <span className="min-w-max p-2 md:p-3 bg-accent dark:bg-accent text-secondary-foreground rounded-md flex items-start justify-start">
                {IconComponent && <IconComponent size={32} color="#fdc800" weight="duotone" className="hover:" />}
                <span className="font-semibold text-lg ms-3">
                    {title}
                </span>
            </span>
            
            <p className="text-muted-foreground  text-sm mt-2">
                {description}
            </p>
        </div>
    </Card>
  )
}
