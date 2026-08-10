import { getTranslations } from "next-intl/server"
import { SiteHero } from "./site-hero"

export async function SiteHeroServer() {
  const t = await getTranslations("hero")

  return (
    <SiteHero
      // t.raw, not t: this key is an array of greetings, not a string.
      greetings={t.raw("greetings") as string[]}
      intro={t("intro")}
      firstName={t("firstName")}
      lastName={t("lastName")}
      subtitle={t("heroSubtitle")}
    />
  )
}
