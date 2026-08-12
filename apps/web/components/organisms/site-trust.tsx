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
  // Two items across three tracks on purpose — the Grids chapter is explicit
  // that not every module needs filling, and the empty third is where the
  // white space comes from. The tracks are content-sized, not equal thirds;
  // see the grid below.
  const stats: { value: ReactNode; label: string }[] = [
    { value: `${certified}`, label: t("trustCertsLabel") },
    {
      // The link followed the fact here out of the hero, where the employer was
      // taking up the one line that should be saying why to keep reading.
      label: t("trustRoleLabel"),
      value: (
        // inline-block so the box hugs the glyphs. As a plain inline run the
        // underline paints across a soft wrap too, which reads as the rule
        // running past the last word.
        <a
          href={NORDCLOUD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-balance underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
        >
          {t("trustRoleValue")}
        </a>
      ),
    },
  ]

  return (
    <section className="bleed-band py-section">
      <div className="mx-auto max-w-page px-gutter">
        {/* Content-sized rather than three equal thirds. Equal columns gave the
            certification count a full ~218px to render one digit while the
            employer name — 25 characters at display size, ~440px — was crushed
            into the same width and broke to one word per line.

            max-content is the label ("Sertifikaattia", the longest, ~108px);
            auto lets the name take what it needs; the 1fr absorbs the rest,
            keeping the empty third the band is built around. If the name ever
            grows, that empty track gives way before the name wraps. */}
        <dl className="grid grid-cols-1 gap-block sm:grid-cols-[max-content_auto_1fr] sm:gap-6">
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
