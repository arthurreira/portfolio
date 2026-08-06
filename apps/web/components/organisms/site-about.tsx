import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { LabeledRow } from "@/components/molecules/labeled-row"
import { LineReveal } from "@/components/molecules/line-reveal"
import {
  ProximityArea,
  ProximityLetters,
} from "@/components/molecules/proximity-text"
import { MdxContent } from "@/components/molecules/mdx-content"
import { Reveal } from "@/components/molecules/reveal"
import Link from "next/link"
import { Card, CardContent, Separator } from "@arthurreira/ui"
import { Button } from "@arthurreira/ui"
import { Badge } from "@arthurreira/ui"

// /ssr, not the package root: this is a server component, and the root entry
// builds an IconContext with createContext, which server components cannot do.
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr"
/** Stagger (s) between cert / sidebar row reveals. */
const ROW_STAGGER_S = 0.06

const CERTS = [
  { name: "AWS Cloud Practitioner", code: "CLF-C02", period: "2026–2029", url: "https://www.credly.com/badges/" },
  { name: "Azure Fundamentals",     code: "AZ-900",  period: "2026",      url: "https://learn.microsoft.com/en-us/credentials/" },
]

export async function SiteAbout() {
  const [t, locale] = await Promise.all([
    getTranslations("about"),
    getLocale(),
  ])

  const aboutContent = about.find((a) => a.locale === locale)

  const sidebar = [
    { label: t("originLabel"),   value: t("originValue")   },
    { label: t("yearsLabel"),    value: t("yearsValue")    },
    { label: t("roleLabel"),     value: t("roleValue")     },
    { label: t("offClockLabel"), value: t("offClockValue") },
  ]

  return (
    <div className="t-shell min-h-screen bg-background pt-10 pb-24">
      <div className="t-about-grid">

        {/* Left */}
        <div>
          {/* font-black / leading / tracking from @layer base h1 */}
          <ProximityArea>
            <h1 className="mb-10 text-[clamp(3rem,11.5vw,11.5rem)]">
              <LineReveal className="text-foreground">
                <ProximityLetters text="Arthur" />
              </LineReveal>
              <LineReveal className="text-primary" delay={0.09}>
                <ProximityLetters text="Ferreira." tone="primary" />
              </LineReveal>
            </h1>
          </ProximityArea>

          {aboutContent && (
            <>
              <MdxContent code={aboutContent.content} variant="typeset" />
            </>
          )}

          {/* Certifications */}
          <Reveal once={false}>
            <p className="label-caps mt-8 mb-5">{t("certsLabel")}</p>
          </Reveal>

          
          <div>
            {CERTS.map((cert, i) => (
              <Reveal key={cert.code} once={false} delay={i * ROW_STAGGER_S}>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-semibold">{cert.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="default">{cert.code}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {cert.period}
                      </span>
                    </div>
                  </div>

                  <Button asChild variant="ghost" size="sm">
                    <Link
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("verified")}
                      <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {i < CERTS.length - 1 && <Separator />}
              </Reveal>
            ))}
          </div>
          <div className="border-t border-border" />

          {/* Language & Personality */}
          <Reveal once={false}>
            <LabeledRow label={t("langLabel")}>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t("langText")}
              </p>
            </LabeledRow>
          </Reveal>
        </div>

        {/* Right — sidebar, rows cascade in */}
        <div className="pt-1">
          {sidebar.map((row, i) => (
            <Reveal key={row.label} once={false} delay={i * ROW_STAGGER_S}>
              <LabeledRow label={row.label}>
                <p className="text-base font-bold text-foreground">
                  {row.value}
                </p>
              </LabeledRow>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
