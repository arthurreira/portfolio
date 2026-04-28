import { about } from '@arthurreira/content'
import { MDXContent } from '@/components/organisms'
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const aboutContent = about.find(a => a.locale === locale)

    if (!aboutContent) {
        return <div>About content not found</div>
    }

    return (
        <div className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-16">
            <div className=' max-w-2xl '>
                <h1 className="font-medium text-base font-heading mb-4">
                    About Me
                </h1>
                <div className=" mt-2">
                    <MDXContent code={aboutContent.content} />
                </div>
            </div>


        </div>
    )
}