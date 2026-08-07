import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { Badge, Button, Separator } from "@arthurreira/ui"
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

/** Stagger (s) between cert / meta reveals. */
const ROW_STAGGER_S = 0.06

/**
 * Shared column template for the certification rows. Declared once so the
 * codes, years and links line up down the page — per-row grids would each
 * size their own columns and the edges would drift.
 */
const CERT_COLUMNS =
  "sm:grid-cols-[minmax(0,1fr)_6rem_7rem_auto] sm:items-center sm:gap-x-6"

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
  {
    name: "AWS AI Practitioner",
    code: "AIF-C01",
    period: "2026",
    url: "https://www.credly.com/badges/",
  },
]

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
    <section className="t-shell pt-12 ">
      {/* One column the whole way down. The facts used to sit in a 280px rail
          beside the bio; as a row of four under it they read as one band of
          standing information rather than a sidebar competing with the prose. */}

      {/* font-black / leading / tracking come from the @layer base h1 */}
      <ProximityArea>
        <h1 className="mb-10 text-[clamp(2rem,11.5vw,11.5rem)]">
          <LineReveal className="text-foreground">
            <ProximityLetters text="Arthur" />
          </LineReveal>
          <LineReveal className="text-primary" delay={0.09}>
            <ProximityLetters text="Ferreira Miranda." tone="primary" />
          </LineReveal>
        </h1>
      </ProximityArea>

 
      {aboutContent && (
        <div className="typeset typeset-notes">
          <MdxContent code={aboutContent.content} variant="typeset" />
        </div>
      )}

      {/* Standing facts — four columns wide, two on a phone. A definition list
          because that is what a label over a value is. */}
      <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
        {facts.map((fact, i) => (
          <Reveal key={fact.label} once={false} delay={i * ROW_STAGGER_S}>
            <dt className="label-caps mb-1.5">{fact.label}</dt>
            <dd className="m-0 text-base font-bold text-foreground">
              {fact.value}
            </dd>
          </Reveal>
        ))}
      </dl>

      <section className="mt-20">
        <Reveal once={false}>
          <p className="label-caps mb-2">{t("certsLabel")}</p>
        </Reveal>

        <ul className="list-none p-0">
          {CERTS.map((cert, i) => (
            <li key={cert.code}>
              <Reveal once={false} delay={i * ROW_STAGGER_S}>
                {/* Stacks on a phone: four columns at that width would put the
                    name on three lines and the link against the edge. */}
                <div
                  className={`grid grid-cols-1 gap-2 border-t border-border py-4 ${CERT_COLUMNS}`}
                >
                  <p className="font-semibold text-foreground">{cert.name}</p>
                  <Badge variant="secondary" className="w-fit">
                    {cert.code}
                  </Badge>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {cert.period}
                  </span>

                  {/* size="sm" already sets the gap and sizes the icon, so it
                      carries no margin or size class of its own. */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-fit justify-self-start sm:justify-self-end"
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
        <Separator  />
      </section>

        <Reveal once={false}>
          <LabeledRow label={t("langLabel")}>
            <p className="text-base leading-relaxed ">
              {t("langText")}
            </p>
          </LabeledRow>
        </Reveal>
    </section>
  )
}
