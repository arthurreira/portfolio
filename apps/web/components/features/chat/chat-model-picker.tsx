"use client"

import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arthurreira/ui/client"

/** The two choices the Worker's allowlist accepts. */
export const MODEL_CHOICES = ["claude", "workers-ai"] as const
export type ModelChoice = (typeof MODEL_CHOICES)[number]

interface ChatModelPickerProps {
  value: ModelChoice
  onChange: (value: ModelChoice) => void
  disabled?: boolean
}

/** Lets the visitor feel the difference between the paid and free model. */
export function ChatModelPicker({
  value,
  onChange,
  disabled = false,
}: ChatModelPickerProps) {
  const t = useTranslations("chat")

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as ModelChoice)}
      disabled={disabled}
    >
      <SelectTrigger size="sm" aria-label={t("modelLabel")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="claude">{t("modelClaude")}</SelectItem>
        <SelectItem value="workers-ai">{t("modelFree")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
