import { ProjectRow } from "@/components/atoms/project-row"
import type { SiteProject } from "@/components/organisms/site-projects"

interface ProjectListProps {
  projects: SiteProject[]
  /** Enlarges the first row and shows its description. Off on the home page,
   *  where the section is already a short curated list. */
  emphasiseFirst?: boolean
}

/** Plain rows, no motion. The scroll-driven parallax drift that used to wrap
 *  each row moved the list against the page as you scrolled, which fought the
 *  reading rhythm on a narrow column. */
export function ProjectList({
  projects,
  emphasiseFirst = true,
}: ProjectListProps) {
  return (
    <div>
      {projects.map((project, i) => (
        <ProjectRow
          key={project.id}
          num={String(i + 1).padStart(2, "0")}
          title={project.title}
          year={project.year}
          href={`/projects/${project.slug}`}
          featured={emphasiseFirst && i === 0}
          description={project.description}
        />
      ))}
      <div className="border-t border-border" />
    </div>
  )
}
