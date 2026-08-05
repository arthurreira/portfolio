"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react/ssr"
import { cn } from "@arthurreira/ui"
import type { ProjectStatus, ProjectRole } from "@arthurreira/content/types"
import { LabeledRow } from "@/components/molecules/labeled-row"
import { LineReveal } from "@/components/molecules/line-reveal"
import {
  ProximityArea,
  ProximityLetters,
} from "@/components/molecules/proximity-text"
import { MdxContent } from "@/components/molecules/mdx-content"
import { Reveal } from "@/components/molecules/reveal"

/** Entrance delay (s) for the header meta block, after the title unmasks. */
const HEADER_META_DELAY_S = 0.12
/** Stagger (s) between sidebar row reveals. */
const SIDEBAR_STAGGER_S = 0.06

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
                <ArrowRight weight="bold" className="size-4" />
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
                <ArrowRight weight="bold" className="size-3.5" />
              </a>
            ),
          },
        ]
      : []),
  ]

  return (
    <div className="min-h-screen bg-background font-ui">

      {/* Header */}
      <div className="t-shell pt-10">
        <Reveal once={false}>
          <p className="label-caps mb-6">
            {t("label")} [{num}]
          </p>
        </Reveal>

        {/* font-black / leading / tracking from @layer base h1 */}
        <ProximityArea>
          <h1 className="mb-6 text-[clamp(2.5rem,8vw,7rem)] text-foreground">
            <LineReveal>
              <ProximityLetters text={title} />
            </LineReveal>
          </h1>
        </ProximityArea>

        <Reveal once={false} delay={HEADER_META_DELAY_S}>
          {techStack && techStack.length > 0 && (
            <p className="mb-1 text-base text-muted-foreground">
              {techStack.map((tech, i) => (
                <span key={tech}>
                  {tech}
                  {i < techStack.length - 1 && (
                    <span className="mx-2 text-muted-foreground opacity-40">·</span>
                  )}
                </span>
              ))}
            </p>
          )}

          <p className={cn("text-sm text-muted-foreground", highlight ? "mb-4" : "mb-8")}>{year}</p>

          {highlight && (
            <p className="mb-8 text-base font-medium tracking-[0.01em] text-primary">
              {highlight}
            </p>
          )}
        </Reveal>

        <div className="h-px bg-border" />

        {/* Cover image — striped placeholder uses --stripe token (flips in light mode) */}
        <Reveal once={false} className="relative mt-8 aspect-[16/7] w-full overflow-hidden bg-muted">
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
                <span className="font-ui text-[11px] uppercase tracking-[0.3em] text-muted-foreground opacity-50">
                  {t("screenshotPlaceholder")}
                </span>
              </div>
            </>
          )}
        </Reveal>
      </div>

      {/* Body */}
      <div className="t-shell pt-12 pb-24">
        <div className="t-detail-body">

          {/* Left — body starts with ## What I built, no redundant description paragraph */}
          <Reveal once={false}>
            <div className="typeset typeset-notes">
              <MdxContent code={content} variant="typeset" />
            </div>

            <div className="mt-16 border-t border-border pt-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-base text-foreground no-underline"
              >
                <ArrowLeft weight="bold" className="size-4" />
                {t("back")}
              </Link>
            </div>
          </Reveal>

          {/* Right — sidebar, rows reveal one after another */}
          <div>
            {sidebarRows.map((row, i) => (
              <Reveal key={row.label} once={false} delay={i * SIDEBAR_STAGGER_S}>
                <LabeledRow label={row.label}>{row.content}</LabeledRow>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
