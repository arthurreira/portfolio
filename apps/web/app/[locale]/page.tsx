import { getTranslations, setRequestLocale } from "next-intl/server"
import { projects } from "@arthurreira/content"
import { Link } from "@/i18n/routing"
import { SiteHeroServer } from "@/components/organisms/site-hero-server"
import { SiteCertifications } from "@/components/organisms/site-certifications"
import { ProjectList } from "@/components/molecules/project-list"

/** How many featured projects the home page shows before "all projects". */
const HOME_PROJECT_LIMIT = 3

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("home")

  // `featured` is a schema field, already set on af-analytics, dns-tool and
  // kernel-monitor. Newest first so the list reorders itself as work lands,
  // rather than needing a hand-maintained order.
  const featured = projects
    .filter((p) => p.locale === locale && p.featured)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, HOME_PROJECT_LIMIT)
    .map((p) => ({
      id: p.slug ?? p.title,
      title: p.title,
      description: p.description,
      year: new Date(p.createdAt).getFullYear().toString(),
      slug: p.slug ?? "",
      locale,
    }))

  return (
    <div className="t-shell flex flex-col gap-20 pb-24">
      <SiteHeroServer />

      <section>
        <h2 className="section-label mb-4">{t("selectedLabel")}</h2>
        {/* No emphasised first row here — the whole section is already a
            three-item curated list, so enlarging one of them says nothing. */}
        <ProjectList projects={featured} emphasiseFirst={false} />
        <Link
          href="/projects"
          className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("allProjects")} →
        </Link>
      </section>

      {/* Summary here, full list on /about — the same block twice would give
          nobody a reason to open the second one. */}
      <SiteCertifications variant="summary" />
    </div>
  )
}
