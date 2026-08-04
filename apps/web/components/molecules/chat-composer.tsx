"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button, Spinner } from "@arthurreira/ui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@arthurreira/ui/client"

interface ChatComposerProps {
  onSend: (text: string) => void
  /** True while a reply is streaming — blocks a second send. */
  isBusy?: boolean
  placeholder: string
  sendLabel: string
}

/**
 * The chat input. Owns only the draft text; sending is the parent's concern.
 *
 * Enter sends, Shift+Enter adds a newline — the convention people expect from
 * a chat box, and the reason this is a textarea rather than an input.
 */
export function ChatComposer({
  onSend,
  isBusy = false,
  placeholder,
  sendLabel,
}: ChatComposerProps) {
  const [draft, setDraft] = useState("")
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
    <form onSubmit={submit}>
      <InputGroup>
        <InputGroupTextarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label={placeholder}
        />
        <InputGroupAddon align="block-end">
          <Button
            type="submit"
            size="icon-sm"
            disabled={!canSend}
            aria-label={sendLabel}
            className="ml-auto"
          >
            {isBusy ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <PaperPlaneTiltIcon data-icon="inline-start" />
            )}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
