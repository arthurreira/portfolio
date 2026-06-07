import { ProjectList } from "@/components/molecules/project-list"

export interface SiteProject {
  id: string
  title: string
  description?: string
  year: string
  slug: string
  locale: string
}

interface SiteProjectsProps {
  projects: SiteProject[]
  heading?: string
  countSuffix?: string
}

export function SiteProjects({
  projects,
  heading = "Projects.",
  countSuffix = "projects",
}: SiteProjectsProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background font-ui">
      <div className="t-shell pt-12 pb-16">
        <h1 className="mb-3 text-[clamp(3rem,11.5vw,11.5rem)] text-foreground">
          {heading}
        </h1>
        <p className="mb-12 text-sm text-muted-foreground">
          {projects.length} {countSuffix}
        </p>

        <ProjectList projects={projects} />
      </div>
    </section>
  )
}
