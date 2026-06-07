import { Link } from "@/i18n/routing"
import { ArrowRight } from "@phosphor-icons/react/ssr"
import { cn } from "@arthurreira/ui"

interface ProjectRowProps {
  num: string
  title: string
  year: string
  href: string
  featured?: boolean
  description?: string
}

export function ProjectRow({ num, title, year, href, featured, description }: ProjectRowProps) {
  return (
    <Link href={href as never} className="group block border-t border-border -mx-2 px-2 py-4 transition-colors duration-150 hover:bg-muted">
      <div className="flex items-center gap-x-5">
        <span className="w-12 shrink-0 font-ui text-[11px] tracking-[0.1em] text-primary leading-none">
          [{num}]
        </span>
        <span
          className={cn(
            "flex-1 font-bold text-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary leading-tight",
            featured ? "text-2xl sm:text-3xl" : "text-base sm:text-lg",
          )}
        >
          {title}
        </span>
        <span className="shrink-0 font-ui text-sm text-foreground tabular-nums">{year}</span>
        <ArrowRight
          weight="bold"
          className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-2 group-hover:text-primary"
        />
      </div>

      {featured && description && (
        <p className="mt-2 max-w-xl pl-[4.25rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Link>
  )
}
