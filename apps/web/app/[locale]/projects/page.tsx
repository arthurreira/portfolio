import { projects } from '@arthurreira/content'
import { FeaturedProjectCard } from "@/components/molecules/projects/featuredProjectCard"
import { ProjectCard } from "@/components/molecules/projects/projectCard"
import { PageHeader } from "@/components/atoms/pageHeader"
import { getTranslations } from 'next-intl/server'
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
     
    const t = await getTranslations("projects")

    const { locale } = await params
    const filteredProjects = projects
    .filter(p => p.locale === locale)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-8">
                <PageHeader title={t("title")} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {filteredProjects.map(project => 
                    project.featured 
                    ? <div key={project.slug} className="md:col-span-2 md:row-span-2">
                        <FeaturedProjectCard {...project} />
                        </div>    
                    : <ProjectCard key={project.slug} {...project} />
                )}
                </div>
        </div>
    )


  
}