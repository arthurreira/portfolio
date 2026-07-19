"use client"

import { ProjectRow } from "@/components/atoms/project-row"
import { Parallax } from "@/components/molecules/parallax"
import { Reveal } from "@/components/molecules/reveal"
import type { SiteProject } from "@/components/organisms/site-projects"

interface ProjectListProps {
  projects: SiteProject[]
}

/**
 * Renders the project rows with a scroll-triggered entrance — each row fades
 * and rises as it enters the viewport (once) — plus a continuous parallax
 * drift tied to scroll position, so the list gains subtle depth as it moves.
 */
export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div>
      {projects.map((project, i) => (
        <Parallax key={project.id}>
          <Reveal once={false}>
            <ProjectRow
              num={String(i + 1).padStart(2, "0")}
              title={project.title}
              year={project.year}
              href={`/projects/${project.slug}`}
              featured={i === 0}
              description={project.description}
            />
          </Reveal>
        </Parallax>
      ))}
      <div className="border-t border-border" />
    </div>
  )
}
