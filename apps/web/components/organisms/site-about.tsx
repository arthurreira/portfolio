import { Fragment } from "react"
import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
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
    <section className="t-shell pt-16 pb-24">
      {/* One reveal, so the name sits on one line — the hero does the same.
          Two reveals put "Arthur" and the surname on separate lines, because
          each LineReveal is a block. */}
      <h1 className="text-display mb-8">
        <LineReveal>
          <span className="text-foreground">Arthur </span>
          <span className="text-primary">Ferreira Miranda.</span>
        </LineReveal>
      </h1>

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
            <dt className="label-caps mb-1.5">{fact.label}</dt>
            <dd className="m-0 text-base font-bold text-foreground">
              {fact.value}
            </dd>
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
