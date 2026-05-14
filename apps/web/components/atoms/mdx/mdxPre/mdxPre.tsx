import { cn } from "@arthurreira/ui"
import type { MdxPreProps } from './mdxPreProps'

export function MdxPre({ className, children, ...props }: MdxPreProps) {
  return (
    <pre className={cn("mb-4 overflow-x-auto rounded-md border p-4", className)} {...props}>
      {children}
    </pre>
  )
}
