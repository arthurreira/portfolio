import Image from "next/image"
import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { RotatingWord } from "@/components/molecules/rotating-word"
import { SEGMENT_STAGGER_S } from "@/lib/motion"
import { MdxContent } from "@/components/molecules/mdx-content"
import { Reveal } from "@/components/molecules/reveal"
import { SiteCertifications } from "@/components/organisms/site-certifications"

export async function SiteAbout() {
  // The name comes from the hero's keys rather than a second hardcoded copy —
  // it is the same h1 on two pages, and two sources drifted apart once already.
  const [t, tHero, locale] = await Promise.all([
    getTranslations("about"),
    getTranslations("hero"),
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
    <section className="mx-auto max-w-page px-gutter pt-frame pb-frame-end">
      {/* Heading on the page's left edge, the secondary element pushed right —
          the same shape /projects and a project page use for their title and
          their count/year. The portrait led this row for a while, which made
          the about page the one heading on the site not starting where its own
          prose starts. */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-display">
          <span className="block">
            <ScrambleText
              text={tHero("firstName")}
              className="text-foreground"
            />
          </span>
          <span className="block">
            {/* Accent on the surname, matching the hero — the two h1s are the
                same thing on two pages and should not diverge. */}
            <ScrambleText
              text={tHero("lastName")}
              delay={SEGMENT_STAGGER_S}
              className="text-primary"
            />
          </span>
        </h1>

        {/* Source is 400×400, so 128 is about as large as it goes before the
            scanline treatment softens. The mask fades its weakest edge out
            rather than ending the image on a hard line. */}
        <Image
          src="/images/minavr.png"
          alt="Arthur Ferreira Miranda"
          width={128}
          height={128}
          className="fade-bottom shrink-0"
          priority
        />
      </div>

      <p className="text-lead mb-6 text-muted-foreground">
        {t("roleLead")}{" "}
        <span className="text-foreground">
          <RotatingWord words={t.raw("specialisms") as string[]} />
        </span>
      </p>

      {aboutContent && (
        <div className="typeset typeset-notes">
          <MdxContent code={aboutContent.content} variant="typeset" />
        </div>
      )}

      <Reveal className="mt-section">
        <h2 className="section-label mb-block">{t("factsLabel")}</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-b border-border p-3 rounded-md"
            >
              <dt className="text-base text-foreground">{fact.label}</dt>
              <dd className="m-0 mt-1 text-sm text-muted-foreground">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-12">
        <SiteCertifications />
      </Reveal>

      <Reveal>
        <section className="mt-16">
          <h2 className="section-label mb-3">{t("langLabel")}</h2>
          <p className="max-w-measure text-base leading-relaxed text-muted-foreground">
            {t("langText")}
          </p>
        </section>
      </Reveal>
    </section>
  )
}
