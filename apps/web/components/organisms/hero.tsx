"use client"


import { BriefcaseMetalIcon, ClockIcon, CodeIcon, MapPinSimpleIcon, RocketLaunchIcon, TranslateIcon } from "@phosphor-icons/react"
import { HeroButtons, HeroCards, HeroStats } from "@/components/molecules"
import { HeroImage, HeroText } from "@/components/atoms"
import { HeroProps } from "./heroProps"

const defaultHeroProps: HeroProps = {
    text: {
        heading: "Morjens, mäoon Arthuri",
        subtitle: "Junior Software Developer Kuopiosta.",
        descriptionFirst:
            "Rakennan ratkaisuja, joissa liiketoiminta ja teknologia kulkevat käsi kädessä. Keskityn moderneihin web-sovelluksiin ja arkkitehtuuriin, joka tuottaa oikeaa arvoa — en vain toimivaa koodia.",
        descriptionSecond:
            "Olen Brasiliasta kotoisin ja asunut Suomessa yli 10 vuotta. Olen utelias ja hands-on-tekijä, joka arvostaa selkeää koodia, hyvää käyttökokemusta ja jatkuvaa kehittymistä.",
    },
    buttons: [
        { href: "/contact", label: "Contact" },
        { href: "/projects", label: "Projects" },
        { href: "/about", label: "About" },
    ],
    stats: [
        { number: "10+", label: "years in Finland", icon: <ClockIcon className="text-primary" size={14} weight="fill" /> },
        { number: "2+", label: "years coding", icon: <CodeIcon className="text-primary" size={14} weight="fill" /> },
        { number: "4", label: "languages", icon: <TranslateIcon className="text-primary" size={14} weight="fill" /> },
    ],
    image: {
        src: "/images/minavr.png",
        alt: "Arthur Ferreira with VR headset",
    },
    cards: [
        {
            title: "Where I'm from",
            description: "Brazilian living in Finland for 10+ years. Currently in Kuopio, North Savo.",
            icon: <MapPinSimpleIcon className="text-primary" size={20} weight="fill" />,
        },
        {
            title: "Current role",
            description: "Junior Software Engineer at Nordcloud Oy. Starting soon — building cloud solutions.",
            icon: <BriefcaseMetalIcon className="text-primary" size={20} weight="fill" />,
        },
        {
            title: "Current project",
            description: "Building nutrineuvo.com — a nutrition platform with modern microservices architecture.",
            icon: <RocketLaunchIcon className="text-primary" size={20} weight="fill" />,
        },
    ],
}

export default function Hero(props: Partial<HeroProps> = {}) {
    const text = props.text ?? defaultHeroProps.text
    const buttons = props.buttons ?? defaultHeroProps.buttons
    const stats = props.stats ?? defaultHeroProps.stats
    const image = props.image ?? defaultHeroProps.image
    const cards = props.cards ?? defaultHeroProps.cards

    return (

        <section className="py-8 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:py-12">
            <div className=" lg:max-w-7xl w-full px-5 sm:px-8 md:px-10 lg:px-4">
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-14 gap-y-8 ">
                    {/* Left column */}
                    <div className="space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1 w-full max-w-3xl lg:max-w-none mx-auto lg:mx-0 text-left lg:text-left">
                        <HeroText
                            heading={text.heading}
                            subtitle={text.subtitle}
                            descriptionFirst={text.descriptionFirst}
                            descriptionSecond={text.descriptionSecond}
                        />
                        <HeroButtons buttons={buttons} />
                            
                       <HeroStats stats={stats} />
                    </div>

                    {/* Center — image */}
                    <div className="flex justify-center">
                        <HeroImage
                            src={image.src}
                            alt={image.alt}
                        />
                    </div>
                    <HeroCards cards={cards} />

                </div>
            </div>
        </section>
    )
}