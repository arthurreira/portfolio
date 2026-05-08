"use client"
import Link from "next/link"
import { HeroCardProps } from "./heroCardProps"
import { Card } from "@arthurreira/ui/components/card"
import { BriefcaseMetalIcon, MapPinSimpleIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@arthurreira/ui/components/popover"



const icons = {
    mapPin: MapPinSimpleIcon,
    briefcase: BriefcaseMetalIcon,
    rocket: RocketLaunchIcon,
}

export function HeroCard({ title, description, icon, href, weather }: HeroCardProps) {
    const IconComponent = icons[icon]
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!weather) return  // only run if weather data exists

        let outerTimer: ReturnType<typeof setTimeout>
        let innerTimer: ReturnType<typeof setTimeout>

        const cycle = () => {
            const delay = Math.random() * 4000 + 2000
            outerTimer = setTimeout(() => {
                setOpen(true)
                innerTimer = setTimeout(() => {
                    setOpen(false)
                    cycle()
                }, 3000)
            }, delay)
        }
        cycle()

        return () => {
            clearTimeout(outerTimer)
            clearTimeout(innerTimer)
        }
    }, [weather])

    const cardEl = (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                <Card className="flex p-2 md:p-3 lg:p-4 hover:-translate-y-1 transition-transform duration-200 hover:shadow-lg">
                    <div>
                        <span className="min-w-max p-2 md:p-3 border rounded-md flex items-start justify-start ">
                            {IconComponent && <IconComponent size={22} weight="duotone" className="text-primary" />}
                            <span className="font-semibold text-lg ms-3">{title}</span>
                        </span>
                        <p className="text-muted-foreground text-sm mt-2">{description}</p>
                    </div>
                </Card>
            </PopoverTrigger>
            {weather && (
                <PopoverContent title="Weather" slot="content" className="w-48 p-4">
                    <p className="text-2xl">{weather.emoji} {weather.temperature}°</p>
                    <p className="text-muted-foreground">{weather.description}</p>
                    <p className="font-semibold">{weather.city}</p>
                </PopoverContent>
            )}
        </Popover>
    )

    if (href) {
        return (
            <Link href={href} target={href.startsWith('http') ? '_blank' : undefined}>
                {cardEl}
            </Link>
        )
    }

    return cardEl
}
