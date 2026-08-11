import { Link } from "@/i18n/routing"
import { cn } from "@arthurreira/ui"

interface ProjectRowProps {
  title: string
  year: string
  href: string
  featured?: boolean
  description?: string
}

/** One project as a border-top row: index, title, year. */
export function ProjectRow({
  title,
  year,
  href,
  featured,
  description,
}: ProjectRowProps) {
  return (
    <Link
      href={href as never}
      className="group -mx-2 block border-t border-border px-2 py-3 transition-colors duration-150 hover:bg-muted"
    >
      <div className="flex items-baseline gap-4 px-2">
        <span
          className={cn(
            "flex-1 text-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary",
            featured ? "text-lg font-bold sm:text-xl" : "text-base"
          )}
        >
          {title}
        </span>
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {year}
        </span>
      </div>

      {featured && description && (
        <p className="mt-2 max-w-measure px-2 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Link>
  )
}
