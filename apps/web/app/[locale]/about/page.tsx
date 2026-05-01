import { about } from '@arthurreira/content'
import { MDXContent } from '@/components/organisms'
import { PageHeader } from "@/components/atoms/pageHeader"
import { getTranslations } from 'next-intl/server'
import { WeatherWidget } from '@/components/molecules/weather/weatherWidget'
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations("about")
    const aboutContent = about.find(a => a.locale === locale)

    if (!aboutContent) {
        return <div>About content not found</div>
    }

    return (
        <div className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-16">
            <div className=' max-w-2xl '>
                <PageHeader title={t("title")} />
                <MDXContent code={aboutContent.content} />
                <WeatherWidget labelFrom={t("weather.from")} labelLive={t("weather.live")} />

            </div>

        </div>
    )
}