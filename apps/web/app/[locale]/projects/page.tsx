import { projects } from '@arthurreira/content'
import { PageHeader } from "@/components/atoms/pageHeader"
import { getTranslations } from 'next-intl/server'
import { CardGrid } from '@arthurreira/ui/components/cardGrid'


function getCardSize(description: string): "small" | "tall" | "wide" | "large" {
  const len = description.length;

  if (len > 200) return "large";
  if (len > 150) return "wide";
  if (len > 100) return "tall";
  return "small";
}
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
     
    const t = await getTranslations("projects")

    const { locale } = await params
    
    const cards = projects 
        .filter(p => p.locale === locale)
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .map(project => ({
            id: project.slug ?? project.title,
            title:  project.title,
            description:    project.description,
            image:  project.coverImage?.src,
            size: getCardSize(project.description),
            url: `/${locale}/projects/${project.slug}`,
            tags: project.techStack

            
        }))

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-4 py-8">
                <PageHeader title={t("title")} />
               

                <CardGrid cards={cards} linkLabel={t("viewProject")}/>
        </div>
    )


  
}