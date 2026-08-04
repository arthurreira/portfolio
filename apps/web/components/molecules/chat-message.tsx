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
        <Bubble variant={isUser ? "default" : "muted"}>
          <BubbleContent className="whitespace-pre-wrap">{text}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
