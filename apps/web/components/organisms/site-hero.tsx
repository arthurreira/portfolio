import { HeroText } from "@/components/molecules/hero-text"

interface SiteHeroProps {
  greeting: string
  firstName: string
  lastName: string
  subtitle: string
}

export function SiteHero({ greeting, firstName, lastName, subtitle }: SiteHeroProps) {
  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">
      <div
        className="t-shell flex-1 flex items-start"
        style={{ paddingTop: "clamp(12vh, 20vh, 28vh)", paddingBottom: "clamp(8vh, 12vh, 16vh)" }}
      >
        <HeroText
          greeting={greeting}
          firstName={firstName}
          lastName={lastName}
          subtitle={subtitle}
        />
      </div>
    </section>
  )
}
