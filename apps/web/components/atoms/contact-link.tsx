import { RailRow } from "@/components/atoms/rail-row"

interface ContactLinkProps {
  /** Where it goes — Email, GitHub, LinkedIn. */
  label: string
  /** The address or handle. */
  value: string
  href: string
  /** The email row, which leads the list. */
  emphasis?: boolean
}

/**
 * The label sits on the rail and the address on the wide axis — the reverse of
 * a project row, because here the address is the thing being read.
 */
export function ContactLink({
  label,
  value,
  href,
  emphasis,
}: ContactLinkProps) {
  return (
    <RailRow meta={label} emphasis={emphasis} external={href}>
      {value}
    </RailRow>
  )
}
