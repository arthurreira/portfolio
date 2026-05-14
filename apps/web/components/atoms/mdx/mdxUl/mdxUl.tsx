import { cn } from "@arthurreira/ui"
import type { MdxUlProps } from './mdxUlProps'

export function MdxUl({ className, children, ...props }: MdxUlProps) {
  return (
    <ul className={cn("list-disc pl-6 mb-4 space-y-2", className)} {...props}>
      {children}
    </ul>
  )
}
