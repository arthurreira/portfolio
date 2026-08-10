import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"
import { Badge } from "@arthurreira/ui"

/**
 * Certifications, read from `packages/content/profile/*.yml` — the same source
 * the chat Worker uses. The about page used to carry its own hardcoded copy of
 * this list, which had already drifted: three entries instead of four,
 * different names, and placeholder Credly URLs with no badge id.
 *
 * Language-neutral on purpose. Certification names are proper nouns; only the
 * status label is translated.
 */
export async function SiteCertifications() {
  const t = await getTranslations("certs")

  return (
    <section>
      <h2 className="label-caps mb-4">{t("label")}</h2>

      <ul className="list-none p-0">
        {profile.certifications.map((cert) => (
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
