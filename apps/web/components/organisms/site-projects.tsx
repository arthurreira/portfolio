import { ScrambleText } from "@/components/molecules/scramble-text"
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

/**
 * The full project list. Same shell, spacing and row treatment as the home
 * page section — the count sits under the heading as a quiet line rather than
 * floating opposite it, which is what the home page does with its labels.
 */
export function SiteProjects({
  projects,
  heading = "Projects.",
  countSuffix = "projects",
}: SiteProjectsProps) {
  return (
    <div className="t-shell pt-16 pb-24">
      <h1 className="text-display mb-2 text-foreground">
        <ScrambleText text={heading} />
      </h1>
      <p className="section-label mb-8">
        {projects.length} {countSuffix}
      </p>

      <ProjectList projects={projects} paginate />
    </div>
  )
}
