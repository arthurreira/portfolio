import type { ReactNode } from "react"

interface LabeledRowProps {
  label: string
  children: ReactNode
}

/**
 * Uppercase label over arbitrary content, closed by a bottom hairline — the
 * shared sidebar/meta row used by the project detail and about pages.
 */
export function LabeledRow({ label, children }: LabeledRowProps) {
  return (
    <div className="border-b border-border py-5">
      <p className="label-caps mb-1.5">{label}</p>
      {children}
    </div>
  )
}
