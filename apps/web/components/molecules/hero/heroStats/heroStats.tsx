"use client"
import { useEffect, useState } from "react"
import { cn } from "@arthurreira/ui/lib/utils"
import { HeroStatsProps } from "./heroStatsProps"
import { HeroStat } from "@/components/atoms/hero"

export function HeroStats({ stats, className }: HeroStatsProps & { className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    let outerTimer: ReturnType<typeof setTimeout>
    let innerTimer: ReturnType<typeof setTimeout>

    const cycle = () => {
      const delay = Math.random() * 3000 + 1000
      outerTimer = setTimeout(() => {
        const next = Math.floor(Math.random() * stats.length)
        setActiveIndex(next)
        innerTimer = setTimeout(() => {
          setActiveIndex(null)
          cycle()
        }, 2500)
      }, delay)
    }

    cycle()

    return () => {
      clearTimeout(outerTimer)
      clearTimeout(innerTimer)
    }
  }, [stats])

  return (
    <div className={cn("grid grid-cols-3 w-full gap-2", className)}>
      {stats.map((stat, index) => (
        <HeroStat key={index} {...stat} visible={activeIndex === index} />
      ))}
    </div>
  )
}
