import { HeroText } from "@/components/molecules/hero-text"

interface SiteHeroProps {
  greetings: string[]
  intro: string
  firstName: string
  lastName: string
  subtitle: string
}

/**
 * Page opener. It used to be a full-height section that filled the viewport
 * with the name and nothing else — a visitor landed, read three lines and had
 * nowhere to go, because the home page had no second section. It is now a
 * normal block at the top of a page that continues below it.
 *
 * The shell lives on the page, not here, so the hero lines up with the
 * sections under it.
 */
export function SiteHero({
  greetings,
  intro,
  firstName,
  lastName,
  subtitle,
}: SiteHeroProps) {
  return (
    <section className="pt-16">
      <HeroText
        greetings={greetings}
        intro={intro}
        firstName={firstName}
        lastName={lastName}
        subtitle={subtitle}
      />
    </section>
  )
}
