import { about } from '@arthurreira/content'
import { MDXContent } from '@/components/organisms'
import { PageHeader } from "@/components/atoms/pageHeader"
import { getTranslations } from 'next-intl/server'
import { WeatherWidget } from '@/components/molecules/weather/weatherWidget'
import { CardGrid } from "@arthurreira/ui/components/cardGrid";
import {type CardItem } from "@arthurreira/ui/lib/cards"
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations("about")
    const aboutContent = about.find(a => a.locale === locale)

    if (!aboutContent) {
        return <div>About content not found</div>
    }
    const cards: CardItem[] = [
    {
        id: "1",
        title: "Brazil → Finland",
        description:
        "Originally from Brazil, living in Kuopio for 10+ years. Two cultures, one developer — and a high tolerance for cold winters and quiet offices.",
        image: "https://picsum.photos/seed/kuopio/600/400",
        size: "large",
    },
    {
        id: "2",
        title: "Junior at Nordcloud",
        description:
        "Working on cloud infrastructure and modern web applications. Learning the enterprise side of the cloud while still shipping real product work.",
        image: "https://picsum.photos/seed/nordcloud/600/400",
        size: "wide",
    },
    {
        id: "3",
        title: "Business Meets Code",
        description:
        "The favorite part isn't shipping features — it's the spot where business needs and code actually meet and produce something that matters.",
        image: "https://picsum.photos/seed/business/600/400",
        size: "tall",
    },
    {
        id: "4",
        title: "Learns by Doing",
        description:
        "Curious by default. Tutorials are fine, but the real learning happens when something is actually being built and breaking in real time.",
        image: "https://picsum.photos/seed/curious/600/400",
        size: "small",
    },
    {
        id: "5",
        title: "Self-Taught Origin Story",
        description:
        "Got into web dev by building free solutions for friends. Helping people turned out to be the best curriculum money couldn't buy.",
        image: "https://picsum.photos/seed/selftaught/600/400",
        size: "wide",
    },
    {
        id: "6",
        title: "dns.arthurreira.dev",
        description:
        "Real-time DNS lookup tool running on AWS Lambda and Redis. A side project that's actually live, actually fast, and actually useful.",
        image: "https://picsum.photos/seed/dns/600/400",
        size: "small",
    },
    {
        id: "7",
        title: "Lambda + Redis Brain",
        description:
        "Comfortable wiring up serverless functions with caching layers. The kind of architecture that disappears when it works correctly.",
        image: "https://picsum.photos/seed/serverless/600/400",
        size: "tall",
    },
    {
        id: "8",
        title: "Miesten Kolmonen",
        description:
        "Plays football in Kuopio's Miesten Kolmonen division. Off the keyboard, on the pitch — same focus, different field.",
        image: "https://picsum.photos/seed/football/600/400",
        size: "wide",
    },
    {
        id: "9",
        title: "Reach Out",
        description:
        "arthur.ferreiramiran@gmail.com — open to interesting problems, cloud architecture conversations, and people who care about the craft.",
        image: "https://picsum.photos/seed/contact/600/400",
        size: "small",
    },
    {
        id: "10",
        title: "Things That Matter",
        description:
        "Not chasing trendy stacks for the sake of it. Building things that solve real problems for real people — that's the whole point.",
        image: "https://picsum.photos/seed/impact/600/400",
        size: "large",
    },
    ]
    return (
         <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-8 space-y-4">
                <PageHeader title={t("title")} />
                <MDXContent code={aboutContent.content} />
                <WeatherWidget labelFrom={t("weather.from")} labelLive={t("weather.live")} />
                <CardGrid cards={cards} />

        </div>
    )
}