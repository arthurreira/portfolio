import { getTranslations, getLocale } from "next-intl/server"
import { about } from "@arthurreira/content"
import { TestMDXContent } from "@/components/molecules/mdx-content"

const CERTS = [
  { name: "AWS Cloud Practitioner", code: "CLF-C02", period: "2026–2029", url: "https://www.credly.com/badges/" },
  { name: "Azure Fundamentals",     code: "AZ-900",  period: "2025",      url: "https://learn.microsoft.com/en-us/credentials/" },
]

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-5">
      <p className="label-caps mb-1.5">{label}</p>
      <p className="font-ui text-base font-bold text-foreground">{value}</p>
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
    <div className="t-shell min-h-screen bg-background pt-10 pb-24 font-ui">
      <div className="t-about-grid">

        {/* Left */}
        <div>
          {/* font-black / leading / tracking from @layer base h1 */}
          <h1 className="mb-10 text-[clamp(3rem,11.5vw,11.5rem)]">
            <span className="block text-foreground">Arthur</span>
            <span className="block text-primary">Ferreira.</span>
          </h1>

          {aboutContent && (
            <div className="max-w-xl">
              <TestMDXContent code={aboutContent.content} />
            </div>
          )}

          {/* Certifications */}
          <p className="label-caps mt-8 mb-5">{t("certsLabel")}</p>

          {CERTS.map((cert) => (
            <div key={cert.code} className="t-cert-row">
              <span className="t-cert-name text-base font-bold text-foreground">{cert.name}</span>
              <span className="text-sm text-muted-foreground">{cert.code}</span>
              <span className="text-sm text-muted-foreground">{cert.period}</span>
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps no-underline"
              >
                {t("verified")}
              </a>
            </div>
          ))}
          <div className="border-t border-border" />
        </div>

        {/* Right — sidebar */}
        <div className="pt-1">
          {sidebar.map((row) => (
            <SidebarRow key={row.label} {...row} />
          ))}
        </div>
      </div>
    </div>
  )
}
