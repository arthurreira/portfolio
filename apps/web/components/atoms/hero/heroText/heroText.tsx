"use client"

import { cn } from "@arthurreira/ui/lib/utils"
import { HeroTextProps } from "./heroTextProps"
import { spring } from "motion"
import { useState, useEffect } from "react"

const springTransition = spring(0.6, 0.3)

export function HeroText({
  heading,
  subtitle,
  descriptionFirst,
  descriptionSecond,
  className,
}: HeroTextProps & { className?: string }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div data-slot="hero-text" className={cn("space-y-4", className)}>
      <h1
        data-loaded={loaded}
        className="hero-h1 relative font-semibold max-w-max justify-center pb-2 font-display text-3xl sm:text-4xl md:text-5xl text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-lg after:bg-foreground after:w-4"
      >
        {heading}
      </h1>
      <p data-loaded={loaded} className="hero-subtitle font-display font-semibold text-foreground">
        {subtitle}
      </p>
      <div className="text-muted-foreground space-y-3">
        <p data-loaded={loaded} className="hero-desc-1">{descriptionFirst}</p>
        <p data-loaded={loaded} className="hero-desc-2">{descriptionSecond}</p>
      </div>


    </div>
  )
}