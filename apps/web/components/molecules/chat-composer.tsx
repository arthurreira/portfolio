"use client"

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { PaperPlaneTiltIcon, SquareIcon } from "@phosphor-icons/react"
import { Button, cn } from "@arthurreira/ui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@arthurreira/ui/client"

/**
 * Mirrors MAX_CHARS_PER_MESSAGE in the Worker's validation. Duplicated rather
 * than shared because the Worker is the authority and must reject regardless of
 * what the browser believes — this copy only exists to warn before that happens.
 */
const MAX_CHARS = 4_000
/** How close to the ceiling before the count is worth showing. */
const WARN_FROM = 3_500

interface ChatComposerProps {
  onSend: (text: string) => void
  /** Aborts the in-flight reply. */
  onStop: () => void
  /** True while a reply is streaming — the send button becomes a stop button. */
  isBusy?: boolean
  placeholder: string
  sendLabel: string
  stopLabel: string
  /** `{count}` is replaced with the characters remaining. */
  charsLeftLabel: string
  tooLongLabel: string
  /** Focus the field on mount — the panel opens ready to type. */
  autoFocus?: boolean
}

/**
 * The chat input. Owns only the draft text; sending is the parent's concern.
 *
 * Enter sends, Shift+Enter adds a newline — the convention people expect from
 * a chat box, and the reason this is a textarea rather than an input.
 */
export function ChatComposer({
  onSend,
  onStop,
  isBusy = false,
  placeholder,
  sendLabel,
  stopLabel,
  charsLeftLabel,
  tooLongLabel,
  autoFocus = false,
}: ChatComposerProps) {
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
          {/* While streaming the same slot becomes a stop control — cancelling
              a long answer is the one thing that saves API credits mid-flight. */}
          {isBusy ? (
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              onClick={onStop}
              aria-label={stopLabel}
              className="ml-auto"
            >
              <SquareIcon weight="fill" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon-sm"
              disabled={!canSend}
              aria-label={sendLabel}
              className="ml-auto"
            >
              <PaperPlaneTiltIcon />
            </Button>
          )}
        </InputGroupAddon>
      </InputGroup>

      {/* Silent until it matters. The Worker refuses an over-long message, and
          being told that after pressing send is far worse than seeing it coming. */}
      {draft.length >= WARN_FROM && (
        <p
          aria-live="polite"
          className={cn(
            "mt-1 text-xs",
            isTooLong ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {isTooLong
            ? tooLongLabel
            : charsLeftLabel.replace("{count}", String(remaining))}
        </p>
      )}
    </form>
  )
}
