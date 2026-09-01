import { getTranslations } from "next-intl/server"
import { SiteHero } from "./site-hero"

export async function SiteHeroServer() {
  const t = await getTranslations("hero")

  return (
    <SiteHero
      firstName={t("firstName")}
      lastName={t("lastName")}
      titleLine={t("titleLine")}
      actionLead={t("actionLead")}
      actions={t.raw("actions") as string[]}
      actionBeforeCompany={t("actionBeforeCompany")}
      companyLabel={t("companyLabel")}
      actionAfterCompany={t("actionAfterCompany")}
    />
  )
}
