import { getTranslations } from 'next-intl/server'
import { HeroButtons, HeroCards, HeroStats } from "@/components/molecules"
import { HeroImage, HeroText } from "@/components/atoms"

export default async function Hero() {
    const t = await getTranslations('hero')

  return (
    <section className="py-8 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:py-12">
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-14 gap-y-8">
        <div className="space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1">
          <HeroText
            heading={t('heading')}
            subtitle={t('subtitle')}
            descriptionFirst={t('descriptionFirst')}
            descriptionSecond={t('descriptionSecond')}
          />
          <HeroButtons buttons={[
            { href: "/contact", label: t('buttons.contact') },
            { href: "/projects", label: t('buttons.projects') },
            { href: "/about", label: t('buttons.about') },
          ]} />
          <HeroStats stats={[
            { number: "10+", label: t('stats.finland'), icon: "clock" },
            { number: "2+", label: t('stats.coding'), icon: "code" },
            { number: "4", label: t('stats.languages'), icon: "translate" },    
          ]} />
        </div>
        <div className="flex justify-center">
          <HeroImage src="/images/minavr.png" alt={t('imageAlt')} />
        </div>
        <HeroCards cards={[
          { title: t('cards.fromTitle'), description: t('cards.fromDesc'), icon: "mapPin" },
          { title: t('cards.roleTitle'), description: t('cards.roleDesc'), icon: "briefcase" },
          { title: t('cards.projectTitle'), description: t('cards.projectDesc'), icon: "rocket" },
        ]} />
      </div>
    </section>
  )
}