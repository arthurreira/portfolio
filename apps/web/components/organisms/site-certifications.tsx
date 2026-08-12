import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"
import { Link } from "@/i18n/routing"
import { RailRow } from "@/components/atoms/rail-row"

const year = (iso: string) => iso.slice(0, 4)

/** How many recent certifications the home page shows. */
const SUMMARY_LIMIT = 3

interface SiteCertificationsProps {
  /** "full" is the whole list, in-progress included — the about page. */
  variant?: "full" | "summary"
}

/**
 * Certifications, read from `packages/content/profile/*.yml` — the same source
 * the chat Worker uses.
 */
export async function SiteCertifications({
  variant = "full",
}: SiteCertificationsProps) {
  const t = await getTranslations("certs")
  const isSummary = variant === "summary"

  const certs = isSummary
    ? profile.certifications
        .filter((c) => c.status === "certified")
        .sort((a, b) => (b.earned ?? "").localeCompare(a.earned ?? ""))
        .slice(0, SUMMARY_LIMIT)
    : profile.certifications

  return (
    <section>
      <h2 className="section-label mb-4">
        {isSummary ? t("latestLabel") : t("label")}
      </h2>

      <div>
        {certs.map((cert) => {
          // The rail carries the year, exactly as it does for a project — the
          // two lists now share one edge instead of each inventing its own.
          const rail =
            cert.status === "in-progress"
              ? t("inProgress")
              : cert.earned
                ? `${year(cert.earned)}${
                    !isSummary && cert.expires ? `–${cert.expires}` : ""
                  }`
                : undefined

          // Hover is only earned where there is somewhere to go.
          return (
            <RailRow
              key={cert.code ?? cert.name}
              meta={rail}
              external={cert.url}
            >
              {cert.name}
              {cert.code && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {cert.code}
                </span>
              )}
            </RailRow>
          )
        })}
        <div className="border-t border-border" />
      </div>

      {isSummary && (
        <Link
          href="/about"
          className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("seeAll")} →
        </Link>
      )}
    </section>
  )
}
