import { projects } from "@arthurreira/content"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { SiteProjectDetail } from "@/components/organisms/site-project-detail"
import { readAiSummary } from "@/lib/ai-summary"

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects
      .filter((p) => p.locale === locale)
      .map((p) => ({ locale, slug: p.slug ?? "" }))
  )
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  // Plain lookup: the list order used to matter because the header showed a
  // "[03]" position, and it no longer does.
  const project = projects.find((p) => p.locale === locale && p.slug === slug)

  if (!project) notFound()

  const aiSummary = await readAiSummary(slug, locale)

  return (
    <SiteProjectDetail
      title={project.title}
      description={project.description}
      problem={project.problem}
      outcome={project.outcome}
      techStack={project.techStack}
      year={new Date(project.createdAt).getFullYear().toString()}
      status={project.status}
      role={project.role}
      highlight={project.highlight}
      url={project.url}
      githubRepo={project.githubRepo}
      aiSummary={aiSummary}
      coverImage={project.coverImage?.src}
      content={project.content}
    />
  )
}
