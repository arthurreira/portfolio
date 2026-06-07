/**
 * Shared timing for theme transitions (mode toggle + flag burst) so the two
 * animations stay in sync. Both reveal via an expanding clip-path circle from
 * the clicked control's origin.
 */
export const THEME_TRANSITION = {
  durationMs: 500,
  easing: "ease-in-out",
} as const
