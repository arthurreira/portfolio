import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"
import { Link } from "@/i18n/routing"

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
          {certs.map((cert, idx) => {
            const dateRange =
              cert.status === "in-progress"
                ? t("inProgress")
                : cert.earned
                  ? `${year(cert.earned)}${
                      !isSummary && cert.expires ? `–${cert.expires}` : ""
                    }`
                  : undefined

            const href = cert.url

            const content = (
              <>
                <div className="text-base text-foreground">{cert.name}</div>
                <div className="text-sm text-muted-foreground tabular-nums">
                  {dateRange}
                  {cert.code && (
                    <>
                      <span> · </span>
                      {cert.code}
                    </>
                  )}
                </div>
              </>
            )

            if (href) {
              return (
                <a
                  key={cert.code ?? cert.name}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block border-b border-border p-3 rounded-md transition-colors duration-150 hover:bg-muted"
                >
                  <div className="flex flex-col gap-1">
                    {content}
                  </div>
                </a>
              )
            }

            return (
              <div
                key={cert.code ?? cert.name}
                className="border-b border-border p-3 rounded-md"
              >
                <div className="flex flex-col gap-1">
                  {content}
                </div>
              </div>
            )
          })}
        </div>
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
