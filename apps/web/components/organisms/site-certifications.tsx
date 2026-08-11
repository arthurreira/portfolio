import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"
import { Badge } from "@arthurreira/ui"
import { Link } from "@/i18n/routing"

/** How many recent certifications the home page shows. */
const SUMMARY_LIMIT = 3

interface SiteCertificationsProps {
  /**
   * "full" is the whole list, in-progress included — the about page.
   * "summary" is the most recently earned few, in-progress excluded — the
   * home page, where the point is what has been achieved lately. Both render
   * as rows, so the block matches the project list above it.
   */
  variant?: "full" | "summary"
}

/**
 * Certifications, read from `packages/content/profile/*.yml` — the same source
 * the chat Worker uses. The about page used to carry its own hardcoded copy of
 * this list, which had already drifted: three entries instead of four,
 * different names, and placeholder Credly URLs with no badge id.
 *
 * Language-neutral on purpose. Certification names and codes are proper nouns;
 * only the status label is translated.
 */
export async function SiteCertifications({
  variant = "full",
}: SiteCertificationsProps) {
  const t = await getTranslations("certs")
  const isSummary = variant === "summary"

  // Sorted by year rather than filtered to one — "certifications earned in
  // 2026" would silently empty this section on 1 January. Most-recent-first
  // keeps "latest" true without a year hardcoded anywhere.
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

            {/* The year on the summary, where recency is the whole point.
                On the full list the in-progress badge is the only marker
                worth carrying — "certified" is the default state, and a
                badge on every row would be noise. */}
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
