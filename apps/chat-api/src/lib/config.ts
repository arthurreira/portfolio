/** Cheapest model that handles portfolio Q&A well. */
const DEFAULT_MODEL = "claude-haiku-4-5"

/** Workers AI model used when Anthropic is unavailable. */
const DEFAULT_FALLBACK_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"

const DEFAULT_MAX_OUTPUT_TOKENS = 1024

/** Absolute ceiling. */
const MAX_OUTPUT_TOKENS_CEILING = 2048

/**
 * Trimmed history window — older turns are dropped before hitting the model.
 */
const DEFAULT_MAX_HISTORY_MESSAGES = 20
const MAX_HISTORY_MESSAGES_CEILING = 50

export interface ChatConfig {
  model: string
  fallbackModel: string
  maxOutputTokens: number
  maxHistoryMessages: number
}

export interface ChatConfigEnv {
  CHAT_MODEL?: string
  CHAT_FALLBACK_MODEL?: string
  CHAT_MAX_OUTPUT_TOKENS?: string
  CHAT_MAX_HISTORY_MESSAGES?: string
}

/** Parses a positive integer, clamped to `ceiling`. */
const positiveInt = (
  raw: string | undefined,
  fallback: number,
  ceiling: number
): number => {
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return Math.min(parsed, ceiling)
}

/** Resolves runtime configuration from the environment. */
export const resolveChatConfig = (env: ChatConfigEnv): ChatConfig => ({
  model: env.CHAT_MODEL?.trim() || DEFAULT_MODEL,
  fallbackModel: env.CHAT_FALLBACK_MODEL?.trim() || DEFAULT_FALLBACK_MODEL,
  maxOutputTokens: positiveInt(
    env.CHAT_MAX_OUTPUT_TOKENS,
    DEFAULT_MAX_OUTPUT_TOKENS,
    MAX_OUTPUT_TOKENS_CEILING
  ),
  maxHistoryMessages: positiveInt(
    env.CHAT_MAX_HISTORY_MESSAGES,
    DEFAULT_MAX_HISTORY_MESSAGES,
    MAX_HISTORY_MESSAGES_CEILING
  ),
})
