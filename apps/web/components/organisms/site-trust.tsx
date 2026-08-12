import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { profile } from "@arthurreira/content"

const NORDCLOUD_URL = "https://nordcloud.com"

/**
 * The one section that escapes the page column. Everything else on the site is
 * contained at 44rem, which gave the page a single texture from top to bottom;
 * one full-width band is what turns a stack into a sequence.
 *
 * It carries the numbers on purpose — the handbook's "trust building" section
 * argues for proof before work, and years/certifications are the proof that
 * exists. Read from the same profile.yml the chat Worker uses, so the site and
 * the assistant can never disagree about them.
 */
export async function SiteTrust() {
  const t = await getTranslations("home")

  const certified = profile.certifications.filter(
    (cert) => cert.status === "certified"
  ).length

  // Years in Finland was here and came out: this band answers "can he do the
  // work", and length of residency answers a different question. It lives on
  // the about page, where biography belongs.
  //
  // Two items in a three-column grid on purpose — the Grids chapter is explicit
  // that not every module needs filling, and the empty third is where the
  // white space comes from.
  const stats: { value: ReactNode; label: string }[] = [
    { value: `${certified}`, label: t("trustCertsLabel") },
    {
      // The link followed the fact here out of the hero, where the employer was
      // taking up the one line that should be saying why to keep reading.
      label: t("trustRoleLabel"),
      value: (
        <a
          href={NORDCLOUD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
        >
          {t("trustRoleValue")}
        </a>
      ),
    },
  ]

  return (
    <section className="bleed-band py-section">
      <div className="mx-auto max-w-page px-gutter">
        <dl className="grid grid-cols-1 gap-block sm:grid-cols-3 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="section-label">{stat.label}</dt>
              <dd className="text-display-sm m-0 mt-1 font-bold text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
