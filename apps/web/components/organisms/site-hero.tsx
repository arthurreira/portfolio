import { HeroText } from "@/components/molecules/hero-text"

interface SiteHeroProps {
  firstName: string
  lastName: string
  titleLine: string
  actionLead: string
  actions: string[]
  actionBeforeCompany: string
  companyLabel: string
  actionAfterCompany: string
}

/** Page opener. */
export function SiteHero({
  firstName,
  lastName,
  titleLine,
  actionLead,
  actions,
  actionBeforeCompany,
  companyLabel,
  actionAfterCompany,
}: SiteHeroProps) {
  return (
    <section className="pt-frame">
      <HeroText
        firstName={firstName}
        lastName={lastName}
        titleLine={titleLine}
        actionLead={actionLead}
        actions={actions}
        actionBeforeCompany={actionBeforeCompany}
        companyLabel={companyLabel}
        actionAfterCompany={actionAfterCompany}
      />
    </section>
  )
}
