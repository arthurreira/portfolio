"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Badge } from "@arthurreira/ui"
import type { ProjectStatus, ProjectRole } from "@arthurreira/content/types"
import { LabeledRow } from "@/components/molecules/labeled-row"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { MdxContent } from "@/components/molecules/mdx-content"
import { Reveal } from "@/components/molecules/reveal"
import { ArrowRightIcon } from "@phosphor-icons/react"

export interface SiteProjectDetailProps {
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
  title, techStack, year, status, role, highlight,
  url, githubRepo, coverImage, content,
}: SiteProjectDetailProps) {
  const t   = useTranslations("project")

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

  // Two groups, not one flat run of five. Role and status describe the work;
  // the links leave the page. Spacing them evenly made those read as the same
  // kind of thing. Year is gone from here entirely — it sits in the rail beside
  // the title now, and printing it twice was the reason this grid had five
  // cells in the first place.
  const facts: { label: string; content: ReactNode }[] = [
    { label: t("role"), content: <p className={rowValueClass}>{resolveRole()}</p> },
    {
      label: t("status"),
      content: <p className={rowValueClass}>{t(`statuses.${status}`)}</p>,
    },
  ]

  const links: { label: string; content: ReactNode }[] = [
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

      <div className="mx-auto max-w-page px-gutter pt-frame pb-frame-end">
        {/* Page edge, matching every other page title. It was text-display-sm
            and competing with the year; the year is meta and now reads as it. */}
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h1 className="text-display text-foreground">
            <ScrambleText text={title} />
          </h1>
          <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {year}
          </p>
        </div>

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

        <dl className="mb-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {facts.map((row) => (
            <LabeledRow key={row.label} label={row.label}>
              {row.content}
            </LabeledRow>
          ))}
        </dl>

        {links.length > 0 && (
          <dl className="mb-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {links.map((row) => (
              <LabeledRow key={row.label} label={row.label}>
                {row.content}
              </LabeledRow>
            ))}
          </dl>
        )}

        {/* No image, no box. A hatched 21:9 placeholder above the fold read as
            an unfinished page rather than as restraint — an absent image is
            quieter than one announcing its own absence.
            The wrapper is load-bearing: <Image fill> is absolutely positioned,
            so it needs the relative box and the aspect ratio to have any size. */}
        {coverImage && (
          <Reveal>
            <div className="relative my-8 aspect-[21/9] w-full overflow-hidden bg-muted">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="typeset typeset-notes">
            <MdxContent code={content} variant="typeset" />
          </div>
        </Reveal>

      </div>
    </div>
  )
}
