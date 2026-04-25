import { Button } from "@arthurreira/ui/components/button"
import { useTranslations } from 'next-intl'



export default function Page() {

  const t = useTranslations('hero')
  
  return (
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
  )
}
