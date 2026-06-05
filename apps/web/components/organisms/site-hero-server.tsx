import { getTranslations } from "next-intl/server"
import { SiteHero } from "./site-hero"

export async function SiteHeroServer() {
  const t = await getTranslations("hero")

  return (
    <SiteHero
      greeting={t("greeting")}
      firstName={t("firstName")}
      lastName={t("lastName")}
      subtitle={t("heroSubtitle")}
    />
  )
}
