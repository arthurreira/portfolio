"use client"
import { cn } from "@arthurreira/ui"
import { PageHeaderProps } from './pageHeaderProps'
import { BackLink } from "@/components/atoms/backLink"

export function PageHeader({ title, className }: PageHeaderProps & { className?: string }) {
  return (
    <div className="flex flex-row gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-4", className)}>
        {title}
      </h2>
      <BackLink />
    </div>
  )
}
