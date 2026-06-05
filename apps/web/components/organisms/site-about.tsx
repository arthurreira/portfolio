import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { TestMDXContent } from "@/components/molecules/mdx-content"

const FONT = "var(--font-ui)"

const CERTS = [
  { name: "AWS Cloud Practitioner", code: "CLF-C02", period: "2026–2029", url: "https://www.credly.com/badges/" },
  { name: "Azure Fundamentals",     code: "AZ-900",  period: "2025",      url: "https://learn.microsoft.com/en-us/credentials/" },
]

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
      <p style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--primary)", margin: 0, marginBottom: "0.375rem" }}>
        {label}
      </p>
      <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", margin: 0 }}>
        {value}
      </p>
    </div>
  )
}

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
    <div className="t-shell" style={{ background: "var(--background)", minHeight: "100vh", fontFamily: FONT, paddingLeft: "calc(var(--sidebar-w) + var(--ticker-gap))", paddingRight: "var(--gutter)", paddingTop: "2.5rem", paddingBottom: "6rem" }}>
      <div className="t-about-grid">

        {/* Left */}
        <div>
          <h1 style={{
            fontWeight: 900, fontSize: "clamp(3rem, 11.5vw, 11.5rem)",
            lineHeight: 0.92, letterSpacing: "-0.045em", margin: 0, marginBottom: "2.5rem",
          }}>
            <span style={{ display: "block", color: "var(--foreground)" }}>Arthur</span>
            <span style={{ display: "block", color: "var(--primary)" }}>Ferreira.</span>
          </h1>

          {aboutContent && (
            <div style={{ maxWidth: "36rem", marginBottom: 0 }}>
              <TestMDXContent code={aboutContent.content} />
            </div>
          )}

          {/* Certifications */}
          <p style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--primary)", margin: 0, marginTop: "2rem", marginBottom: "1.25rem" }}>
            {t("certsLabel")}
          </p>

          {CERTS.map((cert) => (
            <div key={cert.code} className="t-cert-row">
              <span className="t-cert-name" style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>{cert.name}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{cert.code}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{cert.period}</span>
              <a href={cert.url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--primary)", textDecoration: "none" }}>
                {t("verified")}
              </a>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* Right — sidebar */}
        <div style={{ paddingTop: "0.25rem" }}>
          {sidebar.map((row) => (
            <SidebarRow key={row.label} {...row} />
          ))}
        </div>
      </div>
    </div>
  )
}
