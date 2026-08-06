import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { Badge, Button } from "@arthurreira/ui"
import { LabeledRow } from "@/components/molecules/labeled-row"
import { LineReveal } from "@/components/molecules/line-reveal"
import {
  ProximityArea,
  ProximityLetters,
} from "@/components/molecules/proximity-text"
import { MdxContent } from "@/components/molecules/mdx-content"
import { Reveal } from "@/components/molecules/reveal"

// /ssr, not the package root: this is a server component, and the root entry
// builds an IconContext with createContext, which server components cannot do.
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr"

/** Stagger (s) between cert / sidebar row reveals. */
const ROW_STAGGER_S = 0.06

const CERTS = [
  {
    name: "AWS Cloud Practitioner",
    code: "CLF-C02",
    period: "2026–2029",
    url: "https://www.credly.com/badges/",
  },
  {
    name: "Azure Fundamentals",
    code: "AZ-900",
    period: "2026",
    url: "https://learn.microsoft.com/en-us/credentials/",
  },
]

export async function SiteAbout() {
  const [t, locale] = await Promise.all([
    getTranslations("about"),
    getLocale(),
  ])

  const aboutContent = about.find((a) => a.locale === locale)

  const sidebar = [
    { label: t("originLabel"), value: t("originValue") },
    { label: t("yearsLabel"), value: t("yearsValue") },
    { label: t("roleLabel"), value: t("roleValue") },
    { label: t("offClockLabel"), value: t("offClockValue") },
  ]

  return (
    <div className="t-shell min-h-screen bg-background pt-10 pb-24">
      {/* Name and bio on the left, the standing facts on the right. The grid
          collapses to one column at lg, where a 280px rail has no room left. */}
      <div className="t-about-grid">
        <div>
          {/* font-black / leading / tracking come from the @layer base h1 */}
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

          {/* max-w-prose is 65ch, so the measure holds at whatever size the
              typeset token is set to — a rem value would drift with it. The
              typeset classes belong here: variant="typeset" strips the inline
              styles on the assumption this wrapper supplies them. */}
          {aboutContent && (
            <div className="typeset typeset-notes max-w-prose">
              <MdxContent code={aboutContent.content} variant="typeset" />
            </div>
          )}
        </div>

        <div>
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

      {/* Full width, below the grid: these rows want the whole measure, with
          the name at one edge and the credential link at the other. */}
      <section className="mt-20">
        <Reveal once={false}>
          <p className="label-caps mb-2">{t("certsLabel")}</p>
        </Reveal>

        <ul className="list-none p-0">
          {CERTS.map((cert, i) => (
            <li key={cert.code}>
              <Reveal once={false} delay={i * ROW_STAGGER_S}>
                {/* Stacks on a phone — side by side, the link ends up squeezed
                    against a wrapping credential name. */}
                <div className="flex flex-col gap-3 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{cert.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{cert.code}</Badge>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {cert.period}
                      </span>
                    </div>
                  </div>

                  {/* size="sm" already sets the gap and sizes the icon, so the
                      icon carries no margin or size class of its own. */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("verified")}
                      <ArrowUpRightIcon weight="bold" />
                    </a>
                  </Button>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="border-t border-border" />
      </section>

      <section className="mt-16 max-w-prose">
        <Reveal once={false}>
          <LabeledRow label={t("langLabel")}>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("langText")}
            </p>
          </LabeledRow>
        </Reveal>
      </section>
    </div>
  )
}
