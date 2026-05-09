"use client"
import Link from "next/link"
import { HeroCardProps } from "./heroCardProps"
import { BriefcaseMetalIcon, MapPinSimpleIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@arthurreira/ui/components/popover"



const icons = {
    mapPin: MapPinSimpleIcon,
    briefcase: BriefcaseMetalIcon,
    rocket: RocketLaunchIcon,
}

export function HeroCard({ title, description, icon, href, weather, mounted, index }: HeroCardProps & { mounted: boolean; index: number }) {
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
                <div
                    className="hero-card flex flex-row items-center gap-4 max-h-[80px] "
                    data-loaded={mounted}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                >
                    <div>
                        <span className="flex flex-row justify-between  items-center">
                            <span className=" hover:underline">{title}</span>
                            {IconComponent && <IconComponent size={22} weight="thin" className="text-primary hover:text-primary-foreground" />}

                        </span>
                        <p className="text-muted-foreground text-sm ">{description}</p>
                    </div>
                </div>
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
