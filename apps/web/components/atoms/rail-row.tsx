import type { ReactNode } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@arthurreira/ui"

interface RailRowProps {
  /** The wide axis — a project title, a certification, a contact label. */
  children: ReactNode
  /** The rail — a year, a code, a short tag. Right-aligned against the axis. */
  meta?: ReactNode
  /** Internal route. Mutually exclusive with `external`. */
  href?: string
  /** A raw href — absolute URL or mailto. Only http(s) opens in a new tab. */
  external?: string
  /** Enlarges the main axis — the one row per list that leads. */
  emphasis?: boolean
  /** Sits under the main axis, on the same wide axis. */
  description?: string
  className?: string
}

/**
 * The row shared by the project list, the certification list and the contact
 * links. Those were three separate implementations of the same visual that had
 * already drifted apart on padding (px-2 vs px-4) and on where the border sat.
 *
 * Hover no longer recolours the label. The shift plus the muted wash already
 * say "this goes somewhere", and the accent is rationed to the hero name, the
 * nav's active state and the one CTA.
 */
export function RailRow({
  children,
  meta,
  href,
  external,
  emphasis,
  description,
  className,
}: RailRowProps) {
  const body = (
    <>
      <span
        className={cn(
          "rail-main text-foreground transition-transform duration-200",
          href || external ? "group-hover:translate-x-1" : "",
          emphasis ? "text-lg font-bold sm:text-xl" : "text-base"
        )}
      >
        {children}
      </span>

      {meta != null && (
        <span className="rail-meta shrink-0 text-sm text-muted-foreground tabular-nums">
          {meta}
        </span>
      )}

      {description && (
        <p className="col-start-2 mt-2 max-w-measure text-base leading-relaxed text-muted-foreground max-md:col-start-1">
          {description}
        </p>
      )}
    </>
  )

  const shell = cn(
    "rail-row group border-t border-border py-3 transition-colors duration-150",
    (href || external) && "-mx-2 px-2 hover:bg-muted",
    className
  )

  if (external) {
    // mailto: must not open a tab — it leaves a blank one behind after the
    // mail client takes over.
    const newTab = external.startsWith("http")
    return (
      <a
        href={external}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={shell}
      >
        {body}
      </a>
    )
  }

  if (href) {
    return (
      <Link href={href as never} className={shell}>
        {body}
      </Link>
    )
  }

  return <div className={shell}>{body}</div>
}
