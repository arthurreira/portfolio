"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@arthurreira/ui/client"
import { ProjectRow } from "@/components/atoms/project-row"
import type { SiteProject } from "@/components/organisms/site-projects"

/** Rows per page once pagination kicks in. */
const PAGE_SIZE = 8
/** Above this many pages, the strip windows around the current one. */
const MAX_VISIBLE_PAGES = 7

interface ProjectListProps {
  projects: SiteProject[]
  /** Enlarges the first row and shows its description. Off on the home page,
   *  where the section is already a short curated list. */
  emphasiseFirst?: boolean
  /** Off on the home page, which shows a fixed three. */
  paginate?: boolean
}

/**
 * Page numbers to render, with `null` marking an ellipsis. Always keeps the
 * first and last page reachable plus the current one's neighbours, so the
 * strip never grows past MAX_VISIBLE_PAGES slots however long the list gets.
 */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = new Set([1, total, current, current - 1, current + 1])
  const visible = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  return visible.flatMap((page, i) => {
    const previous = visible[i - 1]
    // A gap of more than one means at least one page is being skipped.
    return previous !== undefined && page - previous > 1 ? [null, page] : [page]
  })
}

/** Plain rows, no motion. Paginated on the projects page — 21 projects is a
 *  long scroll — and unpaginated on the home page's curated three. */
export function ProjectList({
  projects,
  emphasiseFirst = true,
  paginate = false,
}: ProjectListProps) {
  const t = useTranslations("projects")
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(projects.length / PAGE_SIZE)
  const showPagination = paginate && totalPages > 1

  const visible = showPagination
    ? projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : projects

  // Buttons, not links: /projects is statically prerendered, and reading the
  // page from a search param would opt the whole route into dynamic
  // rendering. The tradeoff is that a page is not deep-linkable.
  function goTo(next: number) {
    setPage(Math.min(Math.max(next, 1), totalPages))
  }

  return (
    <div>
      {visible.map((project, i) => (
        <ProjectRow
          key={project.id}
          title={project.title}
          year={project.year}
          href={`/projects/${project.slug}`}
          featured={emphasiseFirst && page === 1 && i === 0}
          description={project.description}
        />
      ))}
      <div className="border-t border-border" />

      {showPagination && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text={t("previous")}
                onClick={() => goTo(page - 1)}
                aria-disabled={page === 1}
                className={
                  page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageWindow(page, totalPages).map((slot, i) =>
              slot === null ? (
                <PaginationItem key={`gap-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={slot}>
                  <PaginationLink
                    isActive={slot === page}
                    onClick={() => goTo(slot)}
                    className="cursor-pointer"
                  >
                    {slot}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                text={t("next")}
                onClick={() => goTo(page + 1)}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
