const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

interface TurnstileResponse {
  success: boolean
  "error-codes"?: string[]
}

/** Verifies a Turnstile token server-side. */
export const verifyTurnstile = async (
  token: string,
  secret: string,
  remoteIp?: string
): Promise<boolean> => {
  const body = new FormData()
  body.append("secret", secret)
  body.append("response", token)
  if (remoteIp) body.append("remoteip", remoteIp)

  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body })
    if (!response.ok) {
      console.error("turnstile verify HTTP", response.status)
      return false
    }

    const result = (await response.json()) as TurnstileResponse
    if (!result.success) {
      console.error("turnstile rejected", result["error-codes"])
    }
    return result.success
  } catch (error) {
    console.error("turnstile verify failed", error)
    return false
  }
}
