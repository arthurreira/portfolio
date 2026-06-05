interface ContactLinkProps {
  label: string
  href: string
}

// Large contact link with a trailing arrow.
// Hover: label turns primary; the arrow stays muted (matches original).
export function ContactLink({ label, href }: ContactLinkProps) {
  const external = !href.startsWith("mailto")
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-4 py-2 text-[clamp(1.25rem,3vw,2rem)] font-bold text-foreground transition-colors duration-150 hover:text-primary"
    >
      {label}
      <span className="font-normal text-muted-foreground">→</span>
    </a>
  )
}
