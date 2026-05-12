import { cn } from "@arthurreira/ui"
import type { MdxCodeProps } from './mdxCodeProps'

export function MdxCode({ className, children, ...props }: MdxCodeProps) {
  return (
    <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
      {children}
    </code>
  )
}
