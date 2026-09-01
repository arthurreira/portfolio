import { getTranslations, setRequestLocale } from "next-intl/server"
import { projects } from "@arthurreira/content"
import { Link } from "@/i18n/routing"
import { SiteHeroServer } from "@/components/organisms/site-hero-server"
import { SiteTrust } from "@/components/organisms/site-trust"
import { SiteClosing } from "@/components/organisms/site-closing"
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
  // kernel-monitor.
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

  // Contained → full-bleed → contained. The band is the only thing on the site
  // that touches the viewport edge, so the page reads as a sequence rather than
  // one uninterrupted 44rem column.
  return (
    <>
      <div className="mx-auto max-w-page px-gutter">
        <SiteHeroServer />
      </div>

      <div className="mt-section">
        <SiteTrust />
      </div>

      <div className="mx-auto max-w-page px-gutter pb-frame-end">
        <section className="pt-section">
          <h2 className="section-label mb-block">{t("aboutLabel")}</h2>
          <p className="text-lead max-w-measure text-foreground">
            {t("aboutSummary")}
          </p>
          <Link
            href="/about"
            className="mt-block inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("aboutLink")} →
          </Link>
        </section>

        <section className="pt-section">
          <h2 className="section-label mb-block">{t("selectedLabel")}</h2>
          <ProjectList projects={featured} emphasiseFirst={false} />
          <Link
            href="/projects"
            className="mt-block inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("allProjects")} →
          </Link>
        </section>

        <SiteClosing />
      </div>
    </>
  )
}
