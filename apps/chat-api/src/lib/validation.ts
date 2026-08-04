import { z } from "zod"
import type { UIMessage } from "ai"

/**
 * Limits are sized for what they actually are: a person asking about a
 * portfolio. They are generous enough that no genuine visitor will meet them,
 * and small enough that nobody can turn the endpoint into free inference by
 * pasting a novel into it.
 *
 * Input length is the cost lever the visitor controls, so this is a spend
 * control as much as a correctness one.
 */
const MAX_MESSAGES = 50
const MAX_CHARS_PER_MESSAGE = 4_000
const MAX_TOTAL_CHARS = 24_000

/**
 * Rejected before parsing rather than after. `request.json()` has to
 * materialise the whole body first, so validating the parsed object would mean
 * doing the expensive part before deciding it was too big to accept.
 */
export const MAX_BODY_BYTES = 128 * 1_024

/**
 * Parts are matched loosely on purpose. `useChat` sends part types this Worker
 * has no interest in, and new SDK versions add more; rejecting unknown ones
 * would break the chat on a dependency bump rather than catch an attack. Length
 * is what actually needs bounding, and that is checked wherever text appears.
 */
const partSchema = z
  .object({
    type: z.string(),
    text: z.string().max(MAX_CHARS_PER_MESSAGE).optional(),
  })
  .passthrough()

/**
 * `parts` may legitimately be empty.
 *
 * `useChat` creates the assistant message before anything streams into it, so a
 * request that fails or is stopped leaves an empty one in the transcript.
 * Rejecting that would make a single transient failure poison the whole
 * conversation: the empty message is resent with every following question, so
 * the chat would stay broken until the visitor reloaded. Contentless messages
 * are dropped below instead.
 */
const messageSchema = z
  .object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant", "system"]),
    parts: z.array(partSchema),
  })
  .passthrough()

const requestSchema = z
  .object({
    messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
    locale: z.string().optional(),
    turnstileToken: z.string().optional(),
  })
  .passthrough()

export interface ChatRequest {
  messages: UIMessage[]
  locale?: string
  turnstileToken?: string
}

export type ValidationResult =
  | { ok: true; data: ChatRequest }
  | { ok: false; error: string }

/** Total characters a request would put in front of the model. */
const totalChars = (messages: z.infer<typeof requestSchema>["messages"]) =>
  messages.reduce(
    (sum, message) =>
      sum +
      message.parts.reduce((partSum, part) => partSum + (part.text?.length ?? 0), 0),
    0
  )

/**
 * Validates a decoded request body.
 *
 * Returns a specific error per failure so the UI can eventually say something
 * more useful than "something went wrong" — a visitor who pasted too much text
 * should be told to shorten it, not left guessing.
 */
export const validateChatRequest = (payload: unknown): ValidationResult => {
  const parsed = requestSchema.safeParse(payload)

  if (!parsed.success) {
    const tooLong = parsed.error.issues.some(
      (issue) => issue.code === "too_big" && issue.path.includes("text")
    )
    if (tooLong) return { ok: false, error: "message_too_long" }

    const tooMany = parsed.error.issues.some(
      (issue) => issue.code === "too_big" && issue.path.at(-1) === "messages"
    )
    if (tooMany) return { ok: false, error: "too_many_messages" }

    return { ok: false, error: "invalid_messages" }
  }

  // Checked separately from the per-message cap: many messages that are each
  // just under the limit add up to the same bill as one enormous one.
  if (totalChars(parsed.data.messages) > MAX_TOTAL_CHARS) {
    return { ok: false, error: "conversation_too_long" }
  }

  // Drop anything with no text to contribute. Passing an empty assistant turn
  // upstream is rejected by the model API, so leaving them in would trade a
  // spurious 400 for a spurious 500.
  const messages = parsed.data.messages.filter((message) =>
    message.parts.some((part) => part.text && part.text.length > 0)
  )

  if (messages.length === 0) {
    return { ok: false, error: "invalid_messages" }
  }

  return {
    ok: true,
    data: {
      messages: messages as unknown as UIMessage[],
      locale: parsed.data.locale,
      turnstileToken: parsed.data.turnstileToken,
    },
  }
}
