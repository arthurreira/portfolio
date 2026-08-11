import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"
import { Badge } from "@arthurreira/ui"
import { Link } from "@/i18n/routing"

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
        .sort((a, b) => (b.earned ?? 0) - (a.earned ?? 0))
        .slice(0, SUMMARY_LIMIT)
    : profile.certifications

  return (
    <section>
      <h2 className="section-label mb-4">
        {isSummary ? t("latestLabel") : t("label")}
      </h2>

      <ul className="list-none p-0">
        {certs.map((cert) => (
          <li
            key={cert.code ?? cert.name}
            className="flex items-baseline gap-4 border-t border-border px-2 py-3"
          >
            <span className="flex-1 text-base text-foreground">
              {cert.name}
            </span>

            {cert.code && (
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {cert.code}
              </span>
            )}

            {isSummary
              ? cert.earned && (
                  <span className="w-12 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
                    {cert.earned}
                  </span>
                )
              : cert.status === "in-progress" && (
                  <Badge variant="secondary" className="shrink-0">
                    {t("inProgress")}
                  </Badge>
                )}
          </li>
        ))}
      </ul>
      <div className="border-t border-border" />

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
