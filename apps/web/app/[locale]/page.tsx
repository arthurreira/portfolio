import { setRequestLocale } from "next-intl/server"
import { SiteHeroServer } from "@/components/organisms/site-hero-server"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex flex-col w-full">
      <SiteHeroServer />
    </div>
  )
}
