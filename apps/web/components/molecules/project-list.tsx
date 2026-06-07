"use client"

import { ProjectRow } from "@/components/atoms/project-row"
import { Reveal } from "@/components/molecules/reveal"
import type { SiteProject } from "@/components/organisms/site-projects"

interface ProjectListProps {
  projects: SiteProject[]
}

/**
 * Renders the project rows with a scroll-triggered entrance — each row fades
 * and rises as it enters the viewport (once), so the list reveals on scroll
 * instead of appearing all at once.
 */
export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div>
      {projects.map((project, i) => (
        <Reveal key={project.id}>
          <ProjectRow
            num={String(i + 1).padStart(2, "0")}
            title={project.title}
            year={project.year}
            href={`/projects/${project.slug}`}
            featured={i === 0}
            description={project.description}
          />
        </Reveal>
      ))}
      <div className="border-t border-border" />
    </div>
  )
}
