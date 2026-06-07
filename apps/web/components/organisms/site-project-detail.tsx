"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react/ssr"
import { cn } from "@arthurreira/ui"
import type { ProjectStatus, ProjectRole } from "@arthurreira/content/types"
import { MdxContent } from "@/components/molecules/mdx-content"

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-5">
      <p className="label-caps mb-1.5">{label}</p>
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
  index, title, techStack, year, status, role, highlight,
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
    <div className="min-h-screen bg-background font-ui">

      {/* Header */}
      <div className="t-shell pt-10">
        <p className="label-caps mb-6">
          {t("label")} [{num}]
        </p>

        {/* font-black / leading / tracking from @layer base h1 */}
        <h1 className="mb-6 text-[clamp(2.5rem,8vw,7rem)] text-foreground">
          {title}
        </h1>

        {techStack && techStack.length > 0 && (
          <p className="mb-1 text-sm text-muted-foreground">
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
          <p className="mb-8 text-sm font-medium tracking-[0.01em] text-primary">
            {highlight}
          </p>
        )}

        <div className="h-px bg-border" />

        {/* Cover image — striped placeholder uses --stripe token (flips in light mode) */}
        <div className="relative mt-8 aspect-[16/7] w-full overflow-hidden bg-muted">
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
        </div>
      </div>

      {/* Body */}
      <div className="t-shell pt-12 pb-24">
        <div className="t-detail-body">

          {/* Left — body starts with ## What I built, no redundant description paragraph */}
          <div>
            <MdxContent code={content} />

            <div className="mt-16 border-t border-border pt-8">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-2 text-sm text-foreground no-underline"
              >
                <ArrowLeft weight="bold" className="size-4" />
                {t("back")}
              </Link>
            </div>
          </div>

          {/* Right — sidebar */}
          <div>
            <MetaRow label={t("role")}>
              <p className="text-base font-bold text-foreground">{resolveRole()}</p>
            </MetaRow>
            <MetaRow label={t("year")}>
              <p className="text-base font-bold text-foreground">{year}</p>
            </MetaRow>
            <MetaRow label={t("status")}>
              <p className="text-base font-bold text-foreground">{t(`statuses.${status}`)}</p>
            </MetaRow>
            {url && (
              <MetaRow label={t("live")}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-primary no-underline"
                >
                  {t("viewSite")}
                  <ArrowRight weight="bold" className="size-4" />
                </a>
              </MetaRow>
            )}
            {githubRepo && (
              <MetaRow label={t("source")}>
                <a
                  href={githubRepo.startsWith("http") ? githubRepo : `https://github.com/${githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline"
                >
                  {t("github")}
                  <ArrowRight weight="bold" className="size-3.5" />
                </a>
              </MetaRow>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
