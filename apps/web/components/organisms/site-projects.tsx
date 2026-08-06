import { LineReveal } from "@/components/molecules/line-reveal"
import {
  ProximityArea,
  ProximityLetters,
} from "@/components/molecules/proximity-text"
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
    <section className="relative min-h-screen overflow-hidden bg-background ">
      <div className="t-shell pt-12 pb-16">
        <div className="flex flex-row justify-between ">
          <ProximityArea>
            <h1 className="mb-3 text-[clamp(3rem,11.5vw,11.5rem)] text-foreground">
              <LineReveal>
                <ProximityLetters text={heading} />
              </LineReveal>
            </h1>
          </ProximityArea>
          <p className="mb-12 text-base text-muted-foreground">
            {projects.length} {countSuffix}
          </p>
        </div>


        <ProjectList projects={projects} />
      </div>
    </section>
  )
}
