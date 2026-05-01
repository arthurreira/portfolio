import { cn } from "@arthurreira/ui/lib/utils"
import type { MdxPProps } from './mdxPProps'

export function MdxP({ className, children, ...props }: MdxPProps) {
  return (
    <p className={cn("text-muted-foreground leading-7 mb-4", className)} {...props}>
      {children}
    </p>
  )
}
