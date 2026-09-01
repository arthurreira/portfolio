import Link from "next/link"

import { GlossaryTooltipTerm } from "./glossary-tooltip-term"

export type GlossaryTermProps =
  | {
      term: string
      def: string
      mode: "tooltip"
      href?: never
    }
  | {
      term: string
      def: string
      mode: "link"
      href: string
    }

const termClassName =
  "text-inherit underline decoration-dotted decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"

/** Renders glossary data that has already been resolved by the consuming app. */
export function GlossaryTerm(props: GlossaryTermProps) {
  if (props.mode === "link") {
    return (
      <Link href={props.href} className={termClassName}>
        {props.term}
      </Link>
    )
  }

  return (
    <GlossaryTooltipTerm
      term={props.term}
      def={props.def}
      className={termClassName}
    />
  )
}
