import { useState } from "react"
import type { UIMessage } from "ai"
import { motion } from "motion/react"
import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import {
  Bubble,
  BubbleContent,
  Button,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@arthurreira/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@arthurreira/ui/client"

import { ChatMarkdown } from "@/components/molecules/chat-markdown"
import { splitFollowups } from "@/lib/followups"

interface ChatMessageProps {
  message: UIMessage
  /** Suggested next questions render only on the newest reply; older ones are stale. */
  showFollowups?: boolean
  onFollowup?: (question: string) => void
  /** This reply came from the fallback model rather than the usual one. */
  isDegraded?: boolean
  degradedLabel?: string
  copyLabel?: string
  copiedLabel?: string
}

/**
 * A single chat turn.
 *
 * AI SDK messages carry an array of parts rather than a string, so the text
 * parts are joined here — the assistant streams them in as it generates.
 *
 * Only the assistant gets an avatar. The visitor has no identity in this chat,
 * so a generic icon on every other row would be noise in a narrow panel.
 */
export function ChatMessage({
  message,
  showFollowups = false,
  onFollowup,
  isDegraded = false,
  degradedLabel,
  copyLabel,
  copiedLabel,
}: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const isUser = message.role === "user"

  const raw = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")

  // The assistant appends its suggestions to the same reply, so they have to be
  // peeled off before anything is rendered.
  const { answer, followups } = isUser
    ? { answer: raw, followups: [] }
    : splitFollowups(raw)

  if (!answer) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(answer)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 2_000)
    } catch (error) {
      // Clipboard access can be refused outright; a silent no-op beats an error
      // toast for something the visitor can still select by hand.
      console.error("copy failed", error)
    }
  }

  return (
    <Message align={isUser ? "end" : "start"}>
      {!isUser && (
        <MessageAvatar>
          <Avatar>
            {/* Decorative — the message text carries the meaning. */}
            <AvatarImage src="/images/minavr.png" alt="" />
            <AvatarFallback>AF</AvatarFallback>
          </Avatar>
        </MessageAvatar>
      )}
      <MessageContent>
        {/* `muted` is only 5% opacity in these themes — invisible on a card.
            `outline` reads clearly against the elevated panel surface. */}
        <Bubble variant={isUser ? "default" : "outline"}>
          {/* The visitor's own text is shown verbatim; only the model's reply
              is markdown, and only it gets parsed. */}
          <BubbleContent>
            {isUser ? (
              <span className="whitespace-pre-wrap">{answer}</span>
            ) : (
              <ChatMarkdown>{answer}</ChatMarkdown>
            )}
          </BubbleContent>
        </Bubble>

        {/* Stated plainly rather than as a warning: the answer is real and
            usable, it just came from the weaker model. Alarming styling here
            would misrepresent a working chat as a broken one. */}
        {!isUser && (copyLabel || isDegraded) && (
          <MessageFooter className="flex items-center gap-2">
            {copyLabel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copy}
                aria-label={isCopied ? copiedLabel : copyLabel}
                className="text-muted-foreground h-auto gap-1.5 px-1.5 py-1 text-xs"
              >
                {isCopied ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <CopyIcon className="size-3.5" />
                )}
                {isCopied ? copiedLabel : copyLabel}
              </Button>
            )}
            {isDegraded && degradedLabel && (
              <p className="text-muted-foreground text-xs">{degradedLabel}</p>
            )}
          </MessageFooter>
        )}

        {showFollowups && followups.length > 0 && onFollowup && (
          <MessageFooter className="flex flex-col items-start gap-1.5">
            {followups.map((question, index) => (
              <motion.div
                key={question}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.07 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-auto py-1 text-left whitespace-normal"
                  onClick={() => onFollowup(question)}
                >
                  {question}
                </Button>
              </motion.div>
            ))}
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  )
}
