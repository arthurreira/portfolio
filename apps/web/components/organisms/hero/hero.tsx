import { HeroButtons, HeroCards, HeroStats } from "@/components/molecules"
import { HeroImage, HeroText } from "@/components/atoms"
import { getTranslations, getLocale } from "next-intl/server"
import { CardGrid } from "@arthurreira/ui/client"
export async function Hero() {
  const t = await getTranslations("hero")
  const locale = await getLocale()

  const linkedInLocale = {
    'en': 'en_US',
    'fi': 'fi_FI',
    'pt-br': 'pt_BR'
  }[locale] ?? 'en_US'
function getCardSize(description: string): "small" | "tall" | "wide" | "large" {
  const len = description.length;

  if (len > 90) return "large";
  if (len > 50) return "wide";
  if (len > 20) return "tall";
  return "small";
}
  const weatherRes = await fetch('https://weather.arthurreira.dev/api/weather?city=vila%20xurupita%20(vila%20nova%20mg)')
  const weather = await weatherRes.json()
  return (
    <div className="mx-auto lg:max-w-7xl w-full px-4 sm:px-8 md:px-10 lg:px-4">



      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:items-stretch">
        {/* Tile 1 — intro (text + buttons + stats) */}
        <div className="md:col-span-2 lg:col-span-1  space-y-6">
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

        {/* Tile 2 — image */}
        <div className="flex justify-center items-center p-0 overflow-hidden ">
          <HeroImage src="/images/minavr.png" alt={t("imageAlt")} />

        </div>

        {/* Tile 3 — cards stack (already tiled) */}

        


        <CardGrid
          cards={[
            {
              id: "location",
              title: t("cards.fromTitle"),
              description: t("cards.fromDesc"),
              size: getCardSize(t("cards.fromDesc")),
            },

            {
              id: "role",
              title: t("cards.roleTitle"),
              description: t("cards.roleDesc"),
              size: getCardSize(t("cards.roleDesc")),
            },
            {
              id: "learning",
              title: t("cards.learningTitle"),
              description: t("cards.learningDesc"),
              size: getCardSize(t("cards.learningDesc")),
            },

            {
              id: "devsecops",
              title: t("cards.devsecopsTitle"),
              description: t("cards.devsecopsDesc"),
              size: getCardSize(t("cards.devsecopsDesc")),
            },

            
          ]}
        />
      </div>
    </div>
  )
}