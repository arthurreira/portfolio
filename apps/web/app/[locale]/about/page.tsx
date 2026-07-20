import { setRequestLocale } from "next-intl/server"
import { SiteAbout } from "@/components/organisms/site-about"

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SiteAbout />
}
