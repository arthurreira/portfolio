/** Seconds a throttled caller is asked to wait. */
export const RETRY_AFTER_SECONDS = 60

/** Falls back to a shared bucket when Cloudflare gives us no client IP. */
const UNKNOWN_CALLER = "unknown"

export const callerKey = (request: Request): string =>
  request.headers.get("cf-connecting-ip") ?? UNKNOWN_CALLER

/**
 * Applies the per-IP throttle.
 *
 * Returns true when the caller is over the limit. An unconfigured binding
 * means no throttling rather than a closed door — the limiter is declared in
 * wrangler.jsonc and absent only in local runs.
 */
export const isRateLimited = async (
  request: Request,
  limiter?: RateLimit
): Promise<boolean> => {
  if (!limiter) return false

  const key = callerKey(request)
  const { success } = await limiter.limit({ key })

  if (!success) {
    console.error("rejected: rate limited", key)
    return true
  }

  return false
}
