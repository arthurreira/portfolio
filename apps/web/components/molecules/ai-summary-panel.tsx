"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@arthurreira/ui/components/collapsible"
import { SparkleIcon } from "@phosphor-icons/react"

type AiSummary = {
  summary: string
  /** Localized notice, generated alongside the summary and never optional. */
  disclosure: string
}

export function AiSummaryPanel({ summary, disclosure }: AiSummary) {
  const t = useTranslations("project")
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline decoration-dotted">
        {open ? t("hideAiSummary") : t("viewAiSummary")}
        <SparkleIcon weight="bold" className="size-4 text-primary" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1">
        <p className="text-sm">{summary}</p>
        <p className="text-xs text-muted-foreground italic">{disclosure}</p>
      </CollapsibleContent>
    </Collapsible>
  )
}
