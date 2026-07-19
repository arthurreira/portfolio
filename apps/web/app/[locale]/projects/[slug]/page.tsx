import { projects } from "@arthurreira/content"
import { notFound } from "next/navigation"
import { SiteProjectDetail } from "@/components/organisms/site-project-detail"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  const sorted = projects
    .filter((p) => p.locale === locale)
    .sort((a, b) => Number(b.featured) - Number(a.featured))

  const index = sorted.findIndex((p) => p.slug === slug)
  const project = sorted[index]

  if (!project) notFound()

  return (
    <SiteProjectDetail
      index={index + 1}
      title={project.title}
      description={project.description}
      techStack={project.techStack}
      year={new Date(project.createdAt).getFullYear().toString()}
      status={project.status}
      role={project.role}
      highlight={project.highlight}
      url={project.url}
      githubRepo={project.githubRepo}
      coverImage={project.coverImage?.src}
      content={project.content}
    />
  )
}
