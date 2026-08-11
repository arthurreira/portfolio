interface ContactLinkProps {
  /** Where it goes — Email, GitHub, LinkedIn. */
  label: string
  /** The address or handle, shown right-aligned like a project's year. */
  value: string
  href: string
}

/**
 * One contact as a border-top row: label left, address right. The same shape
 * as the project and certification rows, so every list on the site reads as
 * one system.
 *
 * It used to be 32px bold text with a chasing arrow. The arrow went from the
 * project rows for repeating what the row already said, and the same applies
 * here.
 */
export function ContactLink({ label, value, href }: ContactLinkProps) {
  const external = !href.startsWith("mailto")
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group -mx-2 flex items-baseline gap-4 border-t border-border px-4 py-3 transition-colors duration-150 hover:bg-muted"
    >
      <span className="flex-1 text-base text-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary">
        {label}
      </span>
      <span className="shrink-0 text-sm text-muted-foreground">{value}</span>
    </a>
  )
}
