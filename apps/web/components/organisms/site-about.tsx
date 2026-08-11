import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { MdxContent } from "@/components/molecules/mdx-content"
import { SiteCertifications } from "@/components/organisms/site-certifications"

export async function SiteAbout() {
  const [t, locale] = await Promise.all([
    getTranslations("about"),
    getLocale(),
  ])

  const aboutContent = about.find((a) => a.locale === locale)

  const facts = [
    { label: t("originLabel"), value: t("originValue") },
    { label: t("yearsLabel"), value: t("yearsValue") },
    { label: t("roleLabel"), value: t("roleValue") },
    { label: t("offClockLabel"), value: t("offClockValue") },
  ]

  return (
    <section className="t-shell pt-16">
      <h1 className="text-display">
        <ScrambleText text="Arthur" className="text-foreground" />{" "}
        <ScrambleText
          text="Ferreira Miranda."
          delay={0.12}
          className="text-primary"
        />
      </h1>

      <p className="text-lead mb-6 text-muted-foreground">{t("roleLine")}</p>

      {aboutContent && (
        <div className="typeset typeset-notes">
          <MdxContent code={aboutContent.content} variant="typeset" />
        </div>
      )}

      <dl className="t-detail-meta mt-6">
        {facts.map((fact) => (
          // dt and dd are each a grid item; without a wrapper they land in
          // adjacent cells instead of stacking.
          <div key={fact.label}>
            <dt className="text-base text-foreground">{fact.label}</dt>
            <dd className="m-0 mt-1 text-sm text-muted-foreground">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <SiteCertifications />
      </div>

      <section className="mt-16">
        <h2 className="section-label mb-3">{t("langLabel")}</h2>
        <p className="max-w-measure text-base leading-relaxed text-muted-foreground">
          {t("langText")}
        </p>
      </section>
    </section>
  )
}
