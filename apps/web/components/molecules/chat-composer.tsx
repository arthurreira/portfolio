"use client"

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { PaperPlaneTiltIcon, SquareIcon } from "@phosphor-icons/react"
import { Button } from "@arthurreira/ui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@arthurreira/ui/client"

interface ChatComposerProps {
  onSend: (text: string) => void
  /** Aborts the in-flight reply. */
  onStop: () => void
  /** True while a reply is streaming — the send button becomes a stop button. */
  isBusy?: boolean
  placeholder: string
  sendLabel: string
  stopLabel: string
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
  autoFocus = false,
}: ChatComposerProps) {
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])
  const canSend = draft.trim().length > 0 && !isBusy

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
    </form>
  )
}
