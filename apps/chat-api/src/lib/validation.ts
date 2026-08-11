import { z } from "zod"
import type { UIMessage } from "ai"

/**
 * Limits are sized for what they actually are: a person asking about a
 * portfolio.
 */
const MAX_MESSAGES = 50
const MAX_CHARS_PER_MESSAGE = 4_000
const MAX_TOTAL_CHARS = 24_000

/** Rejected before parsing rather than after. */
export const MAX_BODY_BYTES = 128 * 1_024

/** Parts are matched loosely on purpose. */
const partSchema = z
  .object({
    type: z.string(),
    text: z.string().max(MAX_CHARS_PER_MESSAGE).optional(),
  })
  .passthrough()

/** `parts` may legitimately be empty. */
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
    model: z.unknown().optional(),
  })
  .passthrough()

export type ModelChoice = "claude" | "workers-ai"

/**
 * Anything but the exact free-model id falls back to the default silently — a
 * forged value must not select a model, and must not produce an error that
 * maps out the allowlist either.
 */
const resolveModelChoice = (value: unknown): ModelChoice =>
  value === "workers-ai" ? "workers-ai" : "claude"

export interface ChatRequest {
  messages: UIMessage[]
  locale?: string
  turnstileToken?: string
  model: ModelChoice
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

/** Validates a decoded request body. */
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

  // Drop anything with no text to contribute.
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
      model: resolveModelChoice(parsed.data.model),
    },
  }
}
