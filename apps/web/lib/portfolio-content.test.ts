import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { profile, projects } from "@arthurreira/content"
import { describe, expect, it } from "vitest"

interface PortfolioMessages {
  hero: Record<string, unknown>
  home: Record<string, unknown>
  about: Record<string, unknown>
}

const messages = (locale: "en" | "fi" | "pt-br") =>
  JSON.parse(
    readFileSync(
      fileURLToPath(new URL(`../messages/${locale}.json`, import.meta.url)),
      "utf8"
    )
  ) as PortfolioMessages

const heroTextSource = readFileSync(
  fileURLToPath(
    new URL("../components/molecules/hero-text.tsx", import.meta.url)
  ),
  "utf8"
)

describe("public role and home narrative", () => {
  it("lets the active hero verb determine its width", () => {
    expect(heroTextSource).toContain("reserveWidth={false}")
  })

  // Two different claims, and they drifted apart once already: roleLead is how
  // Arthur describes himself, roleValue is the formal title at the employer.
  const PUBLIC_ROLE = {
    en: { lead: "Software Developer", value: "Application Developer" },
    fi: { lead: "Ohjelmistokehittäjä", value: "Sovelluskehittäjä" },
    "pt-br": {
      lead: "Desenvolvedor de Software",
      value: "Desenvolvedor de Aplicações",
    },
  } as const

  it.each(["en", "fi", "pt-br"] as const)(
    "separates the self-description from the formal job title in %s",
    (locale) => {
      const copy = messages(locale)
      const { lead, value } = PUBLIC_ROLE[locale]

      expect(copy.about.roleLead).toContain(lead)
      expect(copy.about.roleValue).toContain(value)
      // The title this replaced, left in fi and pt-br roleValue while en had
      // moved on. A retired title lingering in one locale is the failure mode.
      expect(JSON.stringify(copy)).not.toContain("Cloud Engineer")
    }
  )

  it.each(["en", "fi", "pt-br"] as const)(
    "uses the approved hero structure and adds an about summary in %s",
    (locale) => {
      const copy = messages(locale)
      const expectedHero = {
        en: {
          titleLine: "Full-stack developer.",
          actionLead: "I",
          actions: ["build", "monitor", "operate", "fix"],
          actionBeforeCompany: "services — at",
          companyLabel: "Nordcloud, an IBM Company",
          actionAfterCompany: ", and for myself on the side.",
        },
        fi: {
          titleLine: "Full-stack-kehittäjä.",
          actionLead: "",
          actions: ["Rakennan", "valvon", "ylläpidän", "korjaan"],
          actionBeforeCompany: "palveluita —",
          companyLabel: "Nordcloudilla",
          actionAfterCompany: ", ja myös omalla ajalla.",
        },
        "pt-br": {
          titleLine: "Full-stack developer.",
          actionLead: "",
          actions: ["Construo", "monitoro", "opero", "conserto"],
          actionBeforeCompany: "serviços — na",
          companyLabel: "Nordcloud, an IBM Company",
          actionAfterCompany: ", e por conta própria também.",
        },
      }

      expect(copy.hero).toMatchObject(expectedHero[locale])
      expect(copy.hero.valueLine).toBeUndefined()
      expect(copy.hero.actionTail).toBeUndefined()
      expect(copy.home.aboutLabel).toBeTypeOf("string")
      expect(copy.home.aboutSummary).toBeTypeOf("string")
      expect(copy.home.aboutLink).toBeTypeOf("string")
    }
  )
})

describe("featured project narrative", () => {
  it.each(["en", "fi", "pt-br"] as const)(
    "gives every featured project a problem and outcome in %s",
    (locale) => {
      const featured = projects.filter(
        (project) => project.locale === locale && project.featured
      ) as Array<Record<string, unknown>>

      expect(featured).toHaveLength(3)
      for (const project of featured) {
        expect(project.problem, `${project.slug}: problem`).toBeTypeOf("string")
        expect(project.outcome, `${project.slug}: outcome`).toBeTypeOf("string")
      }
    }
  )
})

describe("certification metadata", () => {
  it("assigns a Cloud or AI area to every certification", () => {
    const certifications = profile.certifications as Array<
      Record<string, unknown>
    >

    expect(certifications).not.toHaveLength(0)
    for (const certification of certifications) {
      expect(["Cloud", "AI"]).toContain(certification.area)
    }
  })
})
