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
  // Trailing punctuation, split off so it can take the accent. Not scrambled:
  // decoding a single full stop is a frame of noise and nothing else.
  const [, body = heading, punctuation = ""] =
    heading.match(/^(.*?)([.!?…]*)$/) ?? []

  return (
    <div className="t-shell pt-16 pb-24">
      {/* Every other heading on the site splits foreground into accent on its
          second half — "Arthur / Ferreira Miranda.", "Let's / Talk.". This one
          is a single word, so the trailing full stop carries the accent
          instead. Works for Projects. / Projektit. / Projetos. alike. */}
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
