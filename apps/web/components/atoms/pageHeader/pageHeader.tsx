import { cn } from "@arthurreira/ui/lib/utils"
import { PageHeaderProps } from './pageHeaderProps'

export function PageHeader({ title, className }: PageHeaderProps & { className?: string }) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-4", className)}>
      {title}
    </h1>
  )
}
