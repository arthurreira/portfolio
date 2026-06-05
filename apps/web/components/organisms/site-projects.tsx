"use client"

import Link from "next/link"

const FONT = "var(--font-ui)"

export interface SiteProject {
  id: string
  title: string
  description?: string
  year: string
  slug: string | undefined
  locale: string
}

export function SiteProjects({
  projects,
  heading = "Projects.",
  countSuffix = "projects",
}: {
  projects: SiteProject[]
  heading?: string
  countSuffix?: string
}) {
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      background: "var(--background)", overflow: "hidden", fontFamily: FONT,
    }}>

      <div className="t-shell" style={{
        paddingLeft: "calc(var(--sidebar-w) + var(--ticker-gap))",
        paddingRight: "var(--gutter)",
        paddingTop: "3rem", paddingBottom: "4rem",
      }}>
        <h1 style={{
          fontWeight: 900, fontSize: "clamp(3rem, 11.5vw, 11.5rem)",
          lineHeight: 0.92, letterSpacing: "-0.045em",
          color: "var(--foreground)", margin: 0, marginBottom: "0.75rem",
        }}>
          {heading}
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "3rem" }}>
          {projects.length} {countSuffix}
        </p>

        <div>
          {projects.map((project, i) => {
            const num = String(i + 1).padStart(2, "0")
            const isFirst = i === 0

            return (
              <Link key={project.id} href={`/${project.locale}/projects/${project.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "1rem 0.5rem",
                    display: "grid",
                    gridTemplateColumns: "3rem 1fr auto auto",
                    gap: "1.25rem",
                    alignItems: "baseline",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "var(--muted)";
                    const title = (e.currentTarget as HTMLDivElement).querySelector("[data-title]") as HTMLElement | null;
                    if (title) title.style.color = "var(--primary)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                    const title = (e.currentTarget as HTMLDivElement).querySelector("[data-title]") as HTMLElement | null;
                    if (title) title.style.color = "var(--foreground)";
                  }}
                >
                  <span style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.1em", color: "var(--primary)" }}>
                    [{num}]
                  </span>
                  <span data-title style={{
                    fontWeight: 700,
                    fontSize: isFirst ? "1.75rem" : "1.125rem",
                    color: "var(--foreground)", transition: "color 0.15s",
                  }}>
                    {project.title}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: "0.875rem", color: "var(--foreground)" }}>
                    {project.year}
                  </span>
                  <span className="t-arrow" style={{ color: "var(--muted-foreground)", fontSize: "1rem" }}>→</span>
                </div>

                {isFirst && project.description && (
                  <p style={{
                    color: "var(--muted-foreground)", fontSize: "0.875rem",
                    lineHeight: 1.6, maxWidth: "36rem",
                    margin: 0, paddingLeft: "4.25rem", paddingBottom: "0.75rem",
                  }}>
                    {project.description}
                  </p>
                )}
              </Link>
            )
          })}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  )
}
