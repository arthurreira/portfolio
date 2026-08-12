/**
 * Writes one axis of the 2×2 theme matrix (flag × mode) to the DOM, and mirrors
 * it into storage so the inline script in the layout can restore it before
 * first paint.
 *
 * Shared because the two switchers were split across the nav and the footer —
 * language reads as navigation, theme and mode as preference — and both halves
 * still write the same attributes the same way.
 */
export function setAxis(attr: string, storageKey: string, value: string) {
  document.documentElement.setAttribute(`data-${attr}`, value)
  try {
    localStorage.setItem(storageKey, value)
    // Cookie so the server can read it on next navigation (no flash).
    // Secure only over HTTPS so local http dev still stores the cookie.
    const secure = location.protocol === "https:" ? ";Secure" : ""
    document.cookie = `${storageKey}=${value};path=/;max-age=31536000;SameSite=Lax${secure}`
  } catch {
    /* storage unavailable (private mode) — DOM attribute already applied */
  }
}
