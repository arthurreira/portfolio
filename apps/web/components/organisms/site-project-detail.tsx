"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion } from "motion/react"
import { useLenis } from "lenis/react"
import { Badge, cn } from "@arthurreira/ui"
import type { ProjectStatus, ProjectRole } from "@arthurreira/content/types"
import { LabeledRow } from "@/components/molecules/labeled-row"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { MdxContent } from "@/components/molecules/mdx-content"
import { Reveal } from "@/components/molecules/reveal"
import { LINE_EASE } from "@/lib/motion"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
} from "@phosphor-icons/react"
import { AiSummaryPanel } from "@/components/molecules/ai-summary-panel"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@arthurreira/ui/components/collapsible"

export interface SiteProjectDetailProps {
  title: string
  description: string
  problem?: string
  outcome?: string
  techStack?: string[]
  year: string
  status: ProjectStatus
  role?: ProjectRole
  highlight?: string
  url?: string
  githubRepo?: string
  aiSummary?: { summary: string; disclosure: string }
  coverImage?: string
  content: string
}

export function SiteProjectDetail({
  title,
  description,
  problem,
  outcome,
  techStack,
  year,
  status,
  role,
  highlight,
  url,
  githubRepo,
  aiSummary,
  coverImage,
  content,
}: SiteProjectDetailProps) {
  const t = useTranslations("project")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const lenis = useLenis()

  // Lenis caches the scroll limit from content height. Opening the panel adds
  // most of the page in one commit, and without this the wheel does nothing —
  // the reader cannot reach what they just opened.
  useEffect(() => {
    lenis?.resize()
  }, [detailsOpen, lenis])

  function resolveRole(): string {
    // Professional projects with an explicit role → show the role
    if ((status === "done" || status === "ongoing") && role) {
      return t(`roles.${role}`)
    }
    // Context projects → the status describes the work
    if (
      status === "school" ||
      status === "fun" ||
      status === "learning" ||
      status === "someday"
    ) {
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
    {
      label: t("role"),
      content: <p className={rowValueClass}>{resolveRole()}</p>,
    },
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
                href={
                  githubRepo.startsWith("http")
                    ? githubRepo
                    : `https://github.com/${githubRepo}`
                }
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

  // No min-h-screen here: body already paints --background, and the 100vh
  // floor left a screen of nothing between a collapsed page and the footer.
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-page px-gutter pt-frame pb-frame-end">
        {/* Desktop only: below sm this same link lives in the nav, beside the
            brand. It is one affordance rendered in one of two places, never
            both — see the matching sm:hidden in site-nav. */}
        <Link
          href="/projects"
          className="mb-6 hidden w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <ArrowLeftIcon weight="bold" className="size-4" />
          {t("back")}
        </Link>

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

        {aiSummary && (
          <div className="mb-10">
            <AiSummaryPanel
              summary={aiSummary.summary}
              disclosure={aiSummary.disclosure}
            />
          </div>
        )}

        {problem || outcome ? (
          <dl className="mb-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            {problem && (
              <LabeledRow label={t("problem")}>
                <p className="max-w-measure text-base text-foreground">
                  {problem}
                </p>
              </LabeledRow>
            )}
            {outcome && (
              <LabeledRow label={t("outcome")}>
                <p className="max-w-measure text-base text-foreground">
                  {outcome}
                </p>
              </LabeledRow>
            )}
          </dl>
        ) : (
          <p className="max-w-measure mb-10 text-base text-muted-foreground">
            {description}
          </p>
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

        {links.length > 0 && (
          <dl className="mb-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {links.map((row) => (
              <LabeledRow key={row.label} label={row.label}>
                {row.content}
              </LabeledRow>
            ))}
          </dl>
        )}

        {/* One toggle, not one per block. Problem, outcome and the links are
            the page; everything below is detail the reader opts into. */}
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          {/* No top rule of its own: the links row above always closes with a
              LabeledRow hairline, and adding one here drew a second line. */}
          <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left transition-opacity hover:opacity-70">
            <span className="section-label">
              {detailsOpen ? t("viewLess") : t("viewMore")}
            </span>
            <CaretDownIcon
              weight="bold"
              className={cn(
                "size-4 text-primary transition-transform duration-200",
                detailsOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>

          <CollapsibleContent>
            {/* Not Reveal: that animates on scroll-into-view, and this block
                mounts below the fold on click, so it stayed invisible until
                scrolled to. Content the reader opened has already arrived. */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: LINE_EASE }}
              className="typeset typeset-notes mt-8"
            >
              <MdxContent code={content} variant="typeset" />
            </motion.div>

            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {facts.map((row) => (
                <LabeledRow key={row.label} label={row.label}>
                  {row.content}
                </LabeledRow>
              ))}
            </dl>

            {techStack?.length ? (
              <div className="mt-8 border-t border-border pt-4">
                <p className="section-label mb-3">{t("techStack")}</p>
                <div className="flex flex-wrap gap-2">
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
              </div>
            ) : null}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
