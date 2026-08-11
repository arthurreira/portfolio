"use client"

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { PaperPlaneTiltIcon, SquareIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { cn } from "@arthurreira/ui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@arthurreira/ui/client"

/** Mirrors MAX_CHARS_PER_MESSAGE in the Worker's validation. */
const MAX_CHARS = 4_000
/** How close to the ceiling before the count is worth showing. */
const WARN_FROM = 3_500

interface ChatComposerProps {
  onSend: (text: string) => void
  /** Aborts the in-flight reply. */
  onStop: () => void
  /**
   * True while a reply is streaming — the send button becomes a stop button.
   */
  isBusy?: boolean
  placeholder: string
  sendLabel: string
  stopLabel: string
  /** Rendered at the start of the button row, opposite the send control. */
  leading?: React.ReactNode
  /** Focus the field on mount — the panel opens ready to type. */
  autoFocus?: boolean
}

/** The chat input. */
export function ChatComposer({
  onSend,
  onStop,
  isBusy = false,
  placeholder,
  sendLabel,
  stopLabel,
  leading,
  autoFocus = false,
}: ChatComposerProps) {
  // Translated here rather than passed in: `charsLeft` carries an ICU
  // placeholder, and reading it without the value throws a formatting error.
  const t = useTranslations("chat")
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])
  const remaining = MAX_CHARS - draft.length
  const isTooLong = remaining < 0
  const canSend = draft.trim().length > 0 && !isBusy && !isTooLong

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    if (!canSend) return
    onSend(draft.trim())
    setDraft("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <InputGroup>
        <InputGroupTextarea
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label={placeholder}
          // Grow with the text instead of staying one line, capped so a long
          // message can never swallow the transcript above it.
          className="field-sizing-content max-h-32 resize-none"
        />
        <InputGroupAddon align="block-end">
          {leading}

          {draft.length >= WARN_FROM && (
            <InputGroupText
              aria-live="polite"
              className={cn(isTooLong && "text-destructive")}
            >
              {isTooLong ? t("tooLong") : t("charsLeft", { count: remaining })}
            </InputGroupText>
          )}

          {isBusy ? (
            <InputGroupButton
              size="icon-sm"
              variant="secondary"
              onClick={onStop}
              aria-label={stopLabel}
              className="ml-auto"
            >
              <SquareIcon weight="fill" />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="default"
              disabled={!canSend}
              aria-label={sendLabel}
              className="ml-auto"
            >
              <PaperPlaneTiltIcon />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
