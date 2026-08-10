import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"
import { Badge } from "@arthurreira/ui"
import { Link } from "@/i18n/routing"

interface SiteCertificationsProps {
  /**
   * "full" lists every certification with its code and status — the about
   * page. "summary" is one line of codes with a link through to that list —
   * the home page, where repeating the whole block would just be the same
   * content twice with no reason to click.
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

  if (variant === "summary") {
    const done = certs.filter((c) => c.status !== "in-progress")
    const pending = certs.length - done.length

    return (
      <section>
        <h2 className="section-label mb-2">{t("label")}</h2>
        <p className="text-base text-muted-foreground">
          {done.map((c) => c.code ?? c.name).join(" · ")}
          {pending > 0 && ` · ${t("plusInProgress", { count: pending })}`}
        </p>
        <Link
          href="/about"
          className="mt-3 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("seeAll")} →
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h2 className="section-label mb-4">{t("label")}</h2>

      <ul className="list-none p-0">
        {certs.map((cert) => (
          <li
            key={cert.code ?? cert.name}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border py-3"
          >
            <span className="flex-1 text-base text-foreground">
              {cert.name}
            </span>

            {cert.code && (
              <span className="text-sm text-muted-foreground tabular-nums">
                {cert.code}
              </span>
            )}

            {/* Only the in-progress ones need a marker — "certified" is the
                default state and a badge on every row would be noise. */}
            {cert.status === "in-progress" && (
              <Badge variant="secondary">{t("inProgress")}</Badge>
            )}
          </li>
        ))}
      </ul>
      <div className="border-t border-border" />
    </section>
  )
}
