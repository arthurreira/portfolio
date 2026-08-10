import { ArrowRight } from "@phosphor-icons/react/ssr"

interface ContactLinkProps {
  label: string
  href: string
}

// Large contact link with a trailing arrow.
// Hover: label turns primary and slides right; the arrow chases further and
// picks up the accent (same motion language as the project rows).
export function ContactLink({ label, href }: ContactLinkProps) {
  const external = !href.startsWith("mailto")
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-4 py-2 text-display-sm font-bold text-foreground transition-colors duration-150 hover:text-primary"
    >
      <span className="transition-transform duration-200 group-hover:translate-x-1">
        {label}
      </span>
      <ArrowRight
        weight="bold"
        className="size-[0.7em] text-muted-foreground transition-all duration-200 group-hover:translate-x-2 group-hover:text-primary"
      />
    </a>
  )
}
