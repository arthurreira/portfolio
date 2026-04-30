import { cn } from "@arthurreira/ui/lib/utils"
import type { MdxH1Props } from './mdxH1Props'

export function MdxH1({ className, children, ...props }: MdxH1Props) {
  return (
    <h1 className={cn("text-3xl font-bold mb-4", className)} {...props}>
      {children}
    </h1>
  )
}
