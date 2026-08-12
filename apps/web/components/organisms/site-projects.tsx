import { ScrambleText } from "@/components/molecules/scramble-text"
import { ProjectList } from "@/components/molecules/project-list"
import { RailRow } from "@/components/atoms/rail-row"

export interface SiteProject {
  id: string
  title: string
  description?: string
  year: string
  slug: string
  locale: string
  featured?: boolean
}

interface SiteProjectsProps {
  projects: SiteProject[]
  heading?: string
  countSuffix?: string
  selectedLabel?: string
  archiveLabel?: string
}

/** The full project list. */
export function SiteProjects({
  projects,
  heading = "Projects.",
  countSuffix = "projects",
  selectedLabel = "Selected work",
  archiveLabel = "Everything else",
}: SiteProjectsProps) {
  // 21 rows of equal weight is not a portfolio, it is an inventory — and the
  // pagination that managed it was solving the wrong problem. The featured
  // handful leads, at full size and with descriptions; the rest stay
  // reachable underneath as an archive rather than being deleted.
  const selected = projects.filter((project) => project.featured)
  const archive = projects.filter((project) => !project.featured)
  // Trailing punctuation, split off so it can take the accent. Not scrambled:
  // decoding a single full stop is a frame of noise and nothing else.
  const [, body = heading, punctuation = ""] =
    heading.match(/^(.*?)([.!?…]*)$/) ?? []

  return (
    <div className="mx-auto max-w-page px-gutter pt-frame pb-frame-end">
      {/* Title on the page edge, count on the opposite one. The count sat in
          the rail for a while, which pushed the title 6rem in and left it out
          of line with every other page's heading. */}
      <div className="mb-section flex flex-row items-baseline justify-between gap-4">
        <h1 className="text-display">
          <ScrambleText text={body} className="text-foreground" />
          {punctuation && <span className="text-foreground">{punctuation}</span>}
        </h1>
        <p className="section-label shrink-0">
          {projects.length} {countSuffix}
        </p>
      </div>

      {selected.length > 0 && (
        <section className="mb-section">
          <h2 className="section-label mb-block">{selectedLabel}</h2>
          {/* Every selected project carries its description — these are the
              ones a visitor is meant to actually read. */}
          {selected.map((project) => (
            <RailRow
              key={project.id}
              meta={project.year}
              href={`/projects/${project.slug}`}
              emphasis
              description={project.description}
            >
              {project.title}
            </RailRow>
          ))}
          <div className="border-t border-border" />
        </section>
      )}

      <section>
        <h2 className="section-label mb-block">{archiveLabel}</h2>
        <ProjectList projects={archive} emphasiseFirst={false} paginate />
      </section>
    </div>
  )
}
