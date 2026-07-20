import { setRequestLocale } from "next-intl/server"
import { SiteContact } from "@/components/organisms/site-contact"

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SiteContact />
}
