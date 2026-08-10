"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Badge } from "@arthurreira/ui"
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

      <div className="t-shell pt-10 pb-24">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="label-caps">
            {t("label")} [{num}]
          </p>
          <p className="text-sm text-muted-foreground tabular-nums">{year}</p>
        </div>

        {/* h1 gets its weight/leading/tracking from @layer base */}
        <h1 className="text-display-sm mb-6 text-foreground">
          <LineReveal>{title}</LineReveal>
        </h1>

        {highlight && <p className="mb-6 text-primary">{highlight}</p>}

        {techStack?.length ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="default" className="whitespace-nowrap">
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Meta reads as a band under the title now that the page is one
            column — as a 240px right rail it had nowhere to go in a 44rem
            page, and the grid's 42rem + 240px minimum could never fit. */}
        <dl className="t-detail-meta">
          {sidebarRows.map((row) => (
            <LabeledRow key={row.label} label={row.label}>
              {row.content}
            </LabeledRow>
          ))}
        </dl>

        {/* This wrapper is load-bearing: <Image fill> and the striped
            placeholder are both absolutely positioned, so they need the
            relative box and the aspect ratio to have any size at all. */}
        <div className="relative my-10 aspect-[16/7] w-full overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
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
                <span className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase opacity-50">
                  {t("screenshotPlaceholder")}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="typeset typeset-notes">
          <MdxContent code={content} variant="typeset" />
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-base text-foreground no-underline transition-colors hover:text-primary"
          >
            <ArrowLeftIcon weight="bold" className="size-4" />
            {t("back")}
          </Link>
        </div>
      </div>
    </div>
  )
}
