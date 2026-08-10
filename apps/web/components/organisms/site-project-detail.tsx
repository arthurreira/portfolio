"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Badge, cn } from "@arthurreira/ui"
import type { ProjectStatus, ProjectRole } from "@arthurreira/content/types"
import { LabeledRow } from "@/components/molecules/labeled-row"
import { LineReveal } from "@/components/molecules/line-reveal"
import { MdxContent } from "@/components/molecules/mdx-content"
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react"

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
}

export function SiteProjectDetail({
  index, title, techStack, year, status, role, highlight,
  url, githubRepo, coverImage, content,
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

  const rowValueClass = "text-base font-bold text-foreground"
  const sidebarRows: { label: string; content: ReactNode }[] = [
    { label: t("role"), content: <p className={rowValueClass}>{resolveRole()}</p> },
    { label: t("year"), content: <p className={rowValueClass}>{year}</p> },
    {
      label: t("status"),
      content: <p className={rowValueClass}>{t(`statuses.${status}`)}</p>,
    },
    ...(url
      ? [
          {
            label: t("live"),
            content: (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary no-underline"
              >
                {t("viewSite")}
                <ArrowRightIcon weight="bold" className="size-4" />
              </a>
            ),
          },
        ]
      : []),
    ...(githubRepo
      ? [
          {
            label: t("source"),
            content: (
              <a
                href={githubRepo.startsWith("http") ? githubRepo : `https://github.com/${githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline"
              >
                {t("github")}
                <ArrowRightIcon weight="bold" className="size-3.5" />
              </a>
            ),
          },
        ]
      : []),
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="t-shell pt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="label-caps mb-6">
              {t("label")} [{num}]
            </p>
            <p className={cn("text-sm text-muted-foreground", highlight ? "mb-4" : "mb-8")}>{year}</p>

          </div>
          

        {/* font-black / leading / tracking from @layer base h1 */}
        <h1 className="text-display-sm mb-6 text-foreground">
          <LineReveal>{title}</LineReveal>
        </h1>

          {techStack?.length ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="default"
                  className="whitespace-nowrap"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          ): null}
          

        <div className="h-px bg-border" />

        {/* Cover image — striped placeholder uses --stripe token (flips in light mode) */}
          {coverImage ? (
            <Image src={coverImage} alt={title} fill className="object-cover" priority />
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, transparent, transparent 12px, var(--stripe) 12px, var(--stripe) 24px)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground opacity-50">
                  {t("screenshotPlaceholder")}
                </span>
              </div>
            </>
          )}
          
        {highlight && (
            <span className="text-primary">
              {highlight}
            </span>
          )}
      </div>

      {/* Body */}
      <div className="t-shell pb-24">
        <div className="t-detail-body">

          {/* Left — body starts with ## What I built, no redundant description paragraph */}
            <div className="typeset typeset-notes">
              <MdxContent code={content} variant="typeset" />
            </div>

            <div className="mt-16 border-t border-border pt-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-base text-foreground no-underline"
              >
                <ArrowLeftIcon weight="bold" className="size-4" />
                {t("back")}
              </Link>
            </div>

          {/* Right — sidebar */}
          <div>
            {sidebarRows.map((row) => (
              <LabeledRow key={row.label} label={row.label}>
                {row.content}
              </LabeledRow>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
