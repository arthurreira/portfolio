import { projects } from "@arthurreira/content"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { SiteProjects } from "@/components/organisms/site-projects"

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("projects")

  const items = projects
    .filter((p) => p.locale === locale)
    // Featured first, then newest — SiteProjects splits on `featured`, but the
    // archive still wants a sensible order within itself.
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        b.createdAt.localeCompare(a.createdAt)
    )
    .map((p) => ({
      id: p.slug ?? p.title,
      title: p.title,
      description: p.description,
      year: new Date(p.createdAt).getFullYear().toString(),
      slug: p.slug ?? "",
      locale,
      featured: p.featured,
    }))

  return (
    <SiteProjects
      projects={items}
      heading={t("heading")}
      countSuffix={t("countSuffix")}
      selectedLabel={t("selectedLabel")}
      archiveLabel={t("archiveLabel")}
    />
  )
}
