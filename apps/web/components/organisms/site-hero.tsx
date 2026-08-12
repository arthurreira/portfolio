import { HeroText } from "@/components/molecules/hero-text"

interface SiteHeroProps {
  firstName: string
  lastName: string
  roleLine: string
  stages: string[]
}

/** Page opener. */
export function SiteHero({
  firstName,
  lastName,
  roleLine,
  stages,
}: SiteHeroProps) {
  return (
    <section className="pt-frame">
      <HeroText
        firstName={firstName}
        lastName={lastName}
        roleLine={roleLine}
        stages={stages}
      />
    </section>
  )
}
