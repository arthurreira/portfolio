/** Cheapest model that handles portfolio Q&A well. */
const DEFAULT_MODEL = "claude-haiku-4-5"

const DEFAULT_MAX_OUTPUT_TOKENS = 1024

/**
 * Absolute ceiling. Config may lower `maxOutputTokens` but never raise it past
 * this, so a mistyped env var cannot quietly drain the API credit balance.
 */
const MAX_OUTPUT_TOKENS_CEILING = 2048

/** Trimmed history window — older turns are dropped before hitting the model. */
const DEFAULT_MAX_HISTORY_MESSAGES = 20
const MAX_HISTORY_MESSAGES_CEILING = 50

export interface ChatConfig {
  model: string
  maxOutputTokens: number
  maxHistoryMessages: number
}

export interface ChatConfigEnv {
  CHAT_MODEL?: string
  CHAT_MAX_OUTPUT_TOKENS?: string
  CHAT_MAX_HISTORY_MESSAGES?: string
}

/** Parses a positive integer, clamped to `ceiling`. Falls back on anything invalid. */
const positiveInt = (
  raw: string | undefined,
  fallback: number,
  ceiling: number
): number => {
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return Math.min(parsed, ceiling)
}

/**
 * Resolves runtime configuration from the environment.
 *
 * These are operational knobs, not secrets — they exist so the model or the
 * cost ceiling can change without a redeploy. The only secret is the API key.
 */
export const resolveChatConfig = (env: ChatConfigEnv): ChatConfig => ({
  model: env.CHAT_MODEL?.trim() || DEFAULT_MODEL,
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
