import { HeroButtons, HeroCards, HeroStats } from "@/components/molecules"
import { HeroImage, HeroText } from "@/components/atoms"
import { getTranslations, getLocale } from "next-intl/server"
export default async function Hero() {
  const t = await getTranslations("hero")
  const locale = await getLocale()

  const linkedInLocale = {
    'en': 'en_US',
    'fi': 'fi_FI',
    'pt-br': 'pt_BR'
  }[locale] ?? 'en_US'

  const weatherRes = await fetch('https://weather.arthurreira.dev/api/weather?city=vila%20xurupita%20(vila%20nova%20mg)')
  const weather = await weatherRes.json()
  return (
    <section className="min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="mx-auto lg:max-w-7xl w-full px-4 sm:px-8 md:px-10 lg:px-4">

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:items-end gap-y-4 ">

          {/* Column 1 — text, buttons, stats */}
          <div className="space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1 w-full  lg:max-w-none mx-auto lg:mx-0">
            <HeroText
              heading={t("heading")}
              subtitle={t("subtitle")}
              descriptionFirst={t("descriptionFirst")}
              descriptionSecond={t("descriptionSecond")}
            />
            <div className="flex flex-col gap-4 w-fit">
              <HeroButtons
                buttons={[
                  { href: "/contact", label: t("buttons.contact"), variant: "default" },
                  { href: "/projects", label: t("buttons.projects"), variant: "outline" },
                  { href: "/about", label: t("buttons.about"), variant: "link" },
                ]}
              />
              <HeroStats
                stats={[
                  { number: "10+", label: t("stats.finland"), icon: "clock" },
                  { number: "2+", label: t("stats.coding"), icon: "code" },
                  { number: "4", label: t("stats.languages"), icon: "translate" },
                ]}
              />
            </div>
          </div>

          {/* Column 2 — image */}
          <div className="flex justify-center  md:justify-end sm:items-center p-0">
            <HeroImage src="/images/minavr.png" alt={t("imageAlt")} />
          </div>

          {/* Column 3 — cards */}
          <HeroCards
            cards={[
              {
                title: t("cards.fromTitle"), description: t("cards.fromDesc"), icon: "mapPin", href: "/about", weather: {
                  temperature: weather.temperature,
                  emoji: weather.emoji,
                  description: weather.description,
                  city: weather.city
                  
                }
              },
              { title: t("cards.roleTitle"), description: t("cards.roleDesc"), icon: "briefcase", href: `https://www.linkedin.com/in/arthur-ferreira-miranda-66815524a/?locale=${linkedInLocale}` },
              { title: t("cards.projectTitle"), description: t("cards.projectDesc"), icon: "rocket", href: "https://nutrineuvo.com" },
            ]}
          />

        </div>
      </div>
    </section>
  )
}