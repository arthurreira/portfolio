import { LineReveal } from "@/components/molecules/line-reveal"
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
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="t-shell pt-12 pb-16">
        <div className="flex flex-row justify-between ">
          <h1 className="text-display mb-3 text-foreground">
            <LineReveal>{heading}</LineReveal>
          </h1>
          <p className="mb-12 text-base text-muted-foreground">
            {projects.length} {countSuffix}
          </p>
        </div>


        <ProjectList projects={projects} />
      </div>
    </section>
  )
}
