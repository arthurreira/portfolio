"use client"
import { HeroStatProps } from "./heroStatProps"
import { ClockIcon, CodeIcon, TranslateIcon } from "@phosphor-icons/react"
import { Badge, cn } from "@arthurreira/ui"
import { useState, useEffect, useRef } from "react"

const icons = {
  clock: ClockIcon,
  code: CodeIcon,
  translate: TranslateIcon,
}

function useCountUp(target: number, duration: number = 800, trigger: boolean) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!trigger) return

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      // ease in-out — accelerates then decelerates
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      setCount(Math.floor(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setCount(target)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, target, duration])

  return count
}

export function HeroStat({
  number,
  label,
  icon,
  visible,
  mounted,  // ← add
  className,
}: HeroStatProps & { visible: boolean; mounted: boolean; className?: string }) {
  const IconComponent = icons[icon as keyof typeof icons]

  const raw = String(number)
  const numeric = parseInt(raw.replace(/\D/g, ""), 10)
  const suffix = raw.replace(/[0-9]/g, "")



  const count = useCountUp(numeric, 800, mounted)

  return (
    <div
      data-slot="hero-stat"
      data-loaded={mounted}
      className={cn("hero-stat flex items-center gap-1 sm:gap-4", className)}
    >
      <div className="relative">
        {IconComponent && (
          <IconComponent
          size={22} weight="thin" className="text-primary hover:text-primary-foreground"
            data-loaded={mounted}
          />
        )}
        <Badge
          className={cn(
            "absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300",
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1 pointer-events-none"
          )}
        >
          {label}
        </Badge>
      </div>

      <div>
        <h2
          data-mounted={mounted}
          className="hero-stat-number text-lg font-display font-semibold text-foreground"
        >
          {count}{suffix}
        </h2>
      </div>
    </div>
  )
}