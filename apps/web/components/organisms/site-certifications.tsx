import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"
import { Badge, cn } from "@arthurreira/ui"
import { Link } from "@/i18n/routing"

interface SiteCertificationsProps {
  /**
   * "full" spells out every certification name with its code — the about
   * page. "summary" shows the codes alone and links through to that list —
   * the home page, where repeating the full names would be the same content
   * twice with no reason to click. Both render as rows, so the block matches
   * the project list above it.
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
 * only the status labels are translated.
 */
export async function SiteCertifications({
  variant = "full",
}: SiteCertificationsProps) {
  const t = await getTranslations("certs")
  const certs = profile.certifications

  // Summary shows the codes only; the full list spells the names out.
  const isSummary = variant === "summary"

  return (
    <section>
      <h2 className="section-label mb-4">{t("label")}</h2>

      <ul className="list-none p-0">
        {certs.map((cert) => (
          <li
            key={cert.code ?? cert.name}
            className="flex items-baseline gap-4 border-t border-border px-2 py-3"
          >
            {/* Earned ones sit in the muted tone; the in-progress one keeps
                the full foreground colour so the eye lands on the only row
                that is actually news. Same trick as the project rows, where
                weight rather than colour marks the featured one. */}
            <span
              className={cn(
                "flex-1 text-base",
                cert.status === "in-progress"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {isSummary ? (cert.code ?? cert.name) : cert.name}
            </span>

            {!isSummary && cert.code && (
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {cert.code}
              </span>
            )}

            {/* Only the in-progress ones need a marker — "certified" is the
                default state and a badge on every row would be noise. */}
            {cert.status === "in-progress" && (
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
