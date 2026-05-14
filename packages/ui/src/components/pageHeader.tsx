"use client"
import { cn } from "../lib/utils"

type PageHeaderProps = {
  title: string
  className?: string
  children?: React.ReactNode
}
export function PageHeader({ title, className, children }: PageHeaderProps) {
  return (
    <div className="flex flex-row gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-4", className)}>
        {title}
      </h2>
      {children}
    </div>
  )
}
