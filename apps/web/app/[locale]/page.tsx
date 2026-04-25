import Hero from "@/components/organisms/hero"
import { Button } from "@arthurreira/ui/components/button"
import { useTranslations } from 'next-intl'


export default function Page() {

  const t = useTranslations('hero')

  return (
    <>
     <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8   ">
        
        <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-[1.5fr_1fr] ">
          {/* Text column - appears first on mobile, left side on lg */}
          {/* Image column - appears second on mobile, right side on lg */}

          <div className="order-2  flex justify-center lg:justify-end ">


          </div>
        </div>
      </div>
      <div className="flex min-h-svh p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="font-medium">{t('title')}</h1>
            <p>{t('subtitle')}</p>
            <Button className="mt-2">{t('cta')}</Button>
          </div>
          <div className="text-muted-foreground font-mono text-xs">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </div>
    </>
  )
}
