import { getTranslations } from "next-intl/server"
import { SiteHero } from "./site-hero"

export async function SiteHeroServer() {
  const t = await getTranslations("hero")

  return (
    <SiteHero
      firstName={t("firstName")}
      lastName={t("lastName")}
      roleLine={t("roleLine")}
      stages={t.raw("devsecopsStages") as string[]}
    />
  )
}
