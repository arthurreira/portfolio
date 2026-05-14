import { cn } from "@arthurreira/ui"
import type { MdxH2Props } from './mdxH2Props'

export function MdxH2({ className, children, ...props }: MdxH2Props) {
  return (
    <h2 className={cn("text-xl font-semibold mt-8 mb-4", className)} {...props}>
      {children}
    </h2>
  )
}
