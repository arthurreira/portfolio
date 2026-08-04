import type { UIMessage } from "ai"
import { Bubble, BubbleContent, Message, MessageContent } from "@arthurreira/ui"

/**
 * A single chat turn.
 *
 * AI SDK messages carry an array of parts rather than a string, so the text
 * parts are joined here — the assistant streams them in as it generates.
 */
export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user"

  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")

  if (!text) return null

  return (
    <Message align={isUser ? "end" : "start"}>
      <MessageContent>
        {/* `muted` is only 5% opacity in these themes — invisible on a card.
            `outline` reads clearly against the elevated panel surface. */}
        <Bubble variant={isUser ? "default" : "outline"}>
          <BubbleContent className="whitespace-pre-wrap">{text}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
