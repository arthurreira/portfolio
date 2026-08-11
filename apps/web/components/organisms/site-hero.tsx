import type { ReactNode } from "react"
import { HeroText } from "@/components/molecules/hero-text"

interface SiteHeroProps {
  greetings: string[]
  intro: string
  firstName: string
  lastName: string
  subtitle: ReactNode
  cultureLine: string
  stages: string[]
}

/** Page opener. */
export function SiteHero({
  greetings,
  intro,
  firstName,
  lastName,
  subtitle,
  cultureLine,
  stages,
}: SiteHeroProps) {
  return (
    <section className="pt-16">
      <HeroText
        greetings={greetings}
        intro={intro}
        firstName={firstName}
        lastName={lastName}
        subtitle={subtitle}
        cultureLine={cultureLine}
        stages={stages}
      />
    </section>
  )
}
