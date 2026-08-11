import { Fragment } from "react"
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
    <section className="t-shell pt-16 pb-24">
      <h1 className="text-display">
        <ScrambleText text="Arthur" className="text-foreground" />{" "}
        <ScrambleText
          text="Ferreira Miranda."
          delay={0.12}
          className="text-primary"
        />
      </h1>

      {/* Name over role, the way the hero puts the name over what it does.
          Without it the page opened on a name and went straight into prose,
          with nothing saying what the person is. */}
      <p className="text-lead mb-10 text-muted-foreground">{t("roleLine")}</p>

      {aboutContent && (
        <div className="typeset typeset-notes">
          <MdxContent code={aboutContent.content} variant="typeset" />
        </div>
      )}

      {/* Standing facts. Reuses the project page's meta grid rather than a
          second four-column definition of its own — same shape, one rule. */}
      <dl className="t-detail-meta mt-16">
        {facts.map((fact) => (
          // Fragment, not a div: a <dl> may only contain <dt>/<dd> pairs, and
          // a wrapper element between them breaks that.
          <Fragment key={fact.label}>
            {/* Muted sentence-case label over a normal-weight value. It was
                amber uppercase over bold, which made a row of standing facts
                the loudest thing on a page about a person. */}
            <dt className="section-label mb-1">{fact.label}</dt>
            <dd className="m-0 text-base text-foreground">{fact.value}</dd>
          </Fragment>
        ))}
      </dl>

      <div className="mt-16">
        <SiteCertifications />
      </div>

      {/* Not a LabeledRow: that renders its label as label-caps — amber,
          uppercase, wide tracking — which is right for a short meta tag like
          "Role" but made this section heading shout in a different voice from
          every other one on the site. */}
      <section className="mt-16">
        <h2 className="section-label mb-3">{t("langLabel")}</h2>
        <p className="max-w-measure text-base leading-relaxed text-muted-foreground">
          {t("langText")}
        </p>
      </section>
    </section>
  )
}
