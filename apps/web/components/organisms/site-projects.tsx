import { ProjectRow } from "@/components/atoms/project-row"

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

        <div>
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              num={String(i + 1).padStart(2, "0")}
              title={project.title}
              year={project.year}
              href={`/projects/${project.slug}`}
              featured={i === 0}
              description={project.description}
            />
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  )
}
