import type { UIMessage } from "ai"
import {
  Bubble,
  BubbleContent,
  Message,
  MessageAvatar,
  MessageContent,
} from "@arthurreira/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@arthurreira/ui/client"

import { ChatMarkdown } from "@/components/molecules/chat-markdown"

/**
 * A single chat turn.
 *
 * AI SDK messages carry an array of parts rather than a string, so the text
 * parts are joined here — the assistant streams them in as it generates.
 *
 * Only the assistant gets an avatar. The visitor has no identity in this chat,
 * so a generic icon on every other row would be noise in a narrow panel.
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
              <span className="whitespace-pre-wrap">{text}</span>
            ) : (
              <ChatMarkdown>{text}</ChatMarkdown>
            )}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
