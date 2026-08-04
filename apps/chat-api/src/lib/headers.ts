/**
 * Set when the answer came from the fallback model, so the UI can say so rather
 * than passing off a visibly weaker answer as the real thing.
 *
 * Must also be listed in `access-control-expose-headers`, or the browser hides
 * it from page scripts on a cross-origin response.
 *
 * Lives here rather than beside the streaming code so the CORS layer can name it
 * without pulling the AI SDK in with it.
 */
export const DEGRADED_HEADER = "x-chat-degraded"
