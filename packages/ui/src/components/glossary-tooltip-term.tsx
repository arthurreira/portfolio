"use client"

import { useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

export function GlossaryTooltipTerm({
  term,
  def,
  className,
}: {
  term: string
  def: string
  className: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild closeOnClick={false}>
          <button
            type="button"
            className={`${className} cursor-pointer border-0 bg-transparent p-0 [font:inherit]`}
            onClick={() => setOpen((current) => !current)}
          >
            {term}
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{def}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
