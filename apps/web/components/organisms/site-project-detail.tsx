"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import type { ProjectStatus, ProjectRole } from "@arthurreira/content/types"
import { TestMDXContent } from "@/components/molecules/mdx-content"

const FONT = "var(--font-ui)"

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
      <p style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--primary)", margin: 0, marginBottom: "0.375rem" }}>
        {label}
      </p>
      {children}
    </div>
  )
}

export interface SiteProjectDetailProps {
  index: number
  title: string
  description: string
  techStack?: string[]
  year: string
  status: ProjectStatus
  role?: ProjectRole
  highlight?: string
  url?: string
  githubRepo?: string
  coverImage?: string
  content: string
  locale: string
}

export function SiteProjectDetail({
  index, title, description, techStack, year, status, role, highlight,
  url, githubRepo, coverImage, content, locale,
}: SiteProjectDetailProps) {
  const t   = useTranslations("project")
  const num = String(index).padStart(2, "0")

  function resolveRole(): string {
    // Professional projects with an explicit role → show the role
    if ((status === "done" || status === "ongoing") && role) {
      return t(`roles.${role}`)
    }
    // Context projects → the status describes the work
    if (status === "school" || status === "fun" || status === "learning" || status === "someday") {
      return t(`statuses.${status}`)
    }
    return role ? t(`roles.${role}`) : t("defaultRole")
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh", fontFamily: FONT }}>

      {/* Header */}
      <div className="t-shell" style={{ paddingLeft: "calc(var(--sidebar-w) + var(--ticker-gap))", paddingRight: "var(--gutter)", paddingTop: "2.5rem", paddingBottom: 0 }}>
        <p style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary)", margin: 0, marginBottom: "1.5rem" }}>
          {t("label")} [{num}]
        </p>

        <h1 style={{
          fontWeight: 900, fontSize: "clamp(2.5rem, 8vw, 7rem)",
          lineHeight: 0.92, letterSpacing: "-0.045em",
          color: "var(--foreground)", margin: 0, marginBottom: "1.5rem",
        }}>
          {title}
        </h1>

        {techStack && techStack.length > 0 && (
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0, marginBottom: "0.25rem" }}>
            {techStack.map((tech, i) => (
              <span key={tech}>
                {tech}
                {i < techStack.length - 1 && (
                  <span style={{ color: "var(--muted-foreground)", opacity: 0.4, margin: "0 0.5rem" }}>·</span>
                )}
              </span>
            ))}
          </p>
        )}

        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0, marginBottom: highlight ? "1rem" : "2rem" }}>{year}</p>

        {highlight && (
          <p style={{ color: "var(--primary)", fontSize: "0.875rem", fontWeight: 500, margin: 0, marginBottom: "2rem", letterSpacing: "0.01em" }}>
            {highlight}
          </p>
        )}

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Cover image — uses --stripe token so it flips in light mode */}
        <div style={{ marginTop: "2rem", position: "relative", width: "100%", aspectRatio: "16/7", overflow: "hidden", background: "var(--muted)" }}>
          {coverImage ? (
            <Image src={coverImage} alt={title} fill style={{ objectFit: "cover" }} priority />
          ) : (
            <>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 12px, var(--stripe) 12px, var(--stripe) 24px)",
              }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted-foreground)", opacity: 0.5 }}>
                  {t("screenshotPlaceholder")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="t-shell" style={{ paddingLeft: "calc(var(--sidebar-w) + var(--ticker-gap))", paddingRight: "var(--gutter)", paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="t-detail-body">

          {/* Left — body starts with ## What I built, no redundant description paragraph */}
          <div>
            <TestMDXContent code={content} />

            <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
              <Link href={`/${locale}/projects`} style={{ color: "var(--foreground)", fontSize: "0.875rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {t("back")}
              </Link>
            </div>
          </div>

          {/* Right — sidebar */}
          <div>
            <MetaRow label={t("role")}>
              <p style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "1rem", margin: 0 }}>{resolveRole()}</p>
            </MetaRow>
            <MetaRow label={t("year")}>
              <p style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "1rem", margin: 0 }}>{year}</p>
            </MetaRow>
            <MetaRow label={t("status")}>
              <p style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "1rem", margin: 0 }}>{t(`statuses.${status}`)}</p>
            </MetaRow>
            {url && (
              <MetaRow label={t("live")}>
                <a href={url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  {t("viewSite")}
                </a>
              </MetaRow>
            )}
            {githubRepo && (
              <MetaRow label={t("source")}>
                <a href={githubRepo.startsWith("http") ? githubRepo : `https://github.com/${githubRepo}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", textDecoration: "none" }}>
                  {t("github")}
                </a>
              </MetaRow>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
