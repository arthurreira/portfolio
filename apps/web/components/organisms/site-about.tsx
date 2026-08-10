import { Fragment } from "react"
import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { LabeledRow } from "@/components/molecules/labeled-row"
import { LineReveal } from "@/components/molecules/line-reveal"
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
    <section className="t-shell pt-12">
      {/* One column the whole way down. The facts used to sit in a 280px rail
          beside the bio; as a row of four under it they read as one band of
          standing information rather than a sidebar competing with the prose. */}

      {/* font-black / leading / tracking come from the @layer base h1 */}
      <h1 className="mb-10 text-display">
        <LineReveal className="text-foreground">Arthur</LineReveal>
        <LineReveal className="text-primary" delay={0.09}>
          Ferreira Miranda.
        </LineReveal>
      </h1>

      {aboutContent && (
        <div className="typeset typeset-notes">
          <MdxContent code={aboutContent.content} variant="typeset" />
        </div>
      )}

      {/* Standing facts — four columns wide, two on a phone. A definition list
          because that is what a label over a value is. */}
      <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
        {facts.map((fact) => (
          // Fragment, not a div: a <dl> may only contain <dt>/<dd> pairs, and
          // a wrapper element between them breaks that.
          <Fragment key={fact.label}>
            <dt className="label-caps mb-1.5">{fact.label}</dt>
            <dd className="m-0 text-base font-bold text-foreground">
              {fact.value}
            </dd>
          </Fragment>
        ))}
      </dl>

      <div className="mt-20">
        <SiteCertifications />
      </div>

      {/* Its own section, so it gets the same mt-20 rhythm as the certs block.
          It used to sit outside that section with no spacing of its own. */}
      <section className="mt-20">
          <LabeledRow label={t("langLabel")}>
            <p className="max-w-measure text-base leading-relaxed">
              {t("langText")}
            </p>
          </LabeledRow>
      </section>
    </section>
  )
}
