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
    return <Card className="flex items-start gap-x-2 p-2 md:p-3 lg:p-4   hover:translate-3.5    transition-transform duration-200 ">
        <span className="min-w-max text-muted-foreground p-2 md:p-3  bg-muted border border-border hover:bg-muted/80">
            {IconComponent && <IconComponent size={14} weight="fill" className="text-primary transition-transform duration-200 hover:scale-200" />}
        </span>
        <div>
            <span className="font-semibold text-foreground text-lg">{title}</span>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </Card>
}
