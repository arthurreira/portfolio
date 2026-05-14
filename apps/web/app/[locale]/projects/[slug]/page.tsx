import { projects } from '@arthurreira/content'
import { MDXContent } from '@/components/organisms'
import { Badge } from "@arthurreira/ui"

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    // find the project

    const project = projects.find(p => p.slug === slug && p.locale === locale)

    if (!project) {
        return <div>Project not found</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-16">
            <div className="max-w-full mx-auto flex flex-col gap-6">
                {/* header section */}

                <div className="flex flex-col justify-start sm:w-1/1 w-full">

                    <div className="flex items-center justify-between mb-2">
                        <h1 className="font-medium text-base font-heading">
                            {project.title}
                        </h1>
                        <Badge variant="outline">{project.status}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                        {project.description}
                    </p>

                </div>
                {/* add description, status, techStack, links here */}
                <hr className="my-2" />
                <p className="text-xs font-medium tracking-wide text-primary mb-3 font-heading ">
                    {project.techStack?.join(" / ")}
                </p>

                <MDXContent code={project.content} />

            </div>
        </div>
    )
}