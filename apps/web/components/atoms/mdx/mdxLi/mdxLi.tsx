import { cn } from "@arthurreira/ui"
import type { MdxLiProps } from './mdxLiProps'

export function MdxLi({ className, children, ...props }: MdxLiProps) {
  return (
    <li className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </li>
  )
}
