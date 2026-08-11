import { getTranslations } from "next-intl/server"
import { SiteHero } from "./site-hero"

const NORDCLOUD_URL = "https://nordcloud.com"

export async function SiteHeroServer() {
  const t = await getTranslations("hero")

  return (
    <SiteHero
      // t.raw, not t: these keys are arrays of words, not strings.
      greetings={t.raw("greetings") as string[]}
      intro={t("intro")}
      firstName={t("firstName")}
      lastName={t("lastName")}
      // t.rich so the company name stays inside one translated sentence —
      // splitting it into "before"/"after" fragments would not survive word
      // order changing between locales ("na Nordcloud" vs "Nordcloudilla").
      subtitle={t.rich("heroSubtitle", {
        company: (chunks) => (
          <a
            href={NORDCLOUD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
          >
            {chunks}
          </a>
        ),
      })}
      cultureLine={t("cultureLine")}
      stages={t.raw("devsecopsStages") as string[]}
    />
  )
}
