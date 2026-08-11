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

/** The full project list. */
export function SiteProjects({
  projects,
  heading = "Projects.",
  countSuffix = "projects",
}: SiteProjectsProps) {
  // Trailing punctuation, split off so it can take the accent. Not scrambled:
  // decoding a single full stop is a frame of noise and nothing else.
  const [, body = heading, punctuation = ""] =
    heading.match(/^(.*?)([.!?…]*)$/) ?? []

  return (
    <div className="t-shell pt-16 pb-24">
      <div className="flex flex-row justify-between items-baseline gap-4">
        <h1 className="text-display mb-2">
          <ScrambleText text={body} className="text-foreground" />
          {punctuation && <span className="text-primary">{punctuation}</span>}
        </h1>
        <p className="section-label mb-8">
          <span className="text-primary">{projects.length}</span> {countSuffix}
        </p>
      </div>


      <ProjectList projects={projects} paginate />
    </div>
  )
}
