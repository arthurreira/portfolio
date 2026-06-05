import { projects } from "@arthurreira/content"
import { getTranslations } from "next-intl/server"
import { SiteProjects } from "@/components/organisms/site-projects"

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("projects")

  const items = projects
    .filter((p) => p.locale === locale)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .map((p) => ({
      id: p.slug ?? p.title,
      title: p.title,
      description: p.description,
      year: new Date(p.createdAt).getFullYear().toString(),
      slug: p.slug,
      locale,
    }))

  return (
    <SiteProjects
      projects={items}
      heading={t("heading")}
      countSuffix={t("countSuffix")}
    />
  )
}
