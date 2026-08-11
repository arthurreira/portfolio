/**
 * Shared easing for every entrance on the site — the hero decode, the
 * paragraphs under it, and the page transition. Expo-out: fast to start,
 * long settle.
 *
 * It used to live in line-reveal.tsx, which was deleted when the masked
 * reveals became scrambles; the curve outlived the component that introduced
 * it.
 */
export const LINE_EASE = [0.22, 1, 0.36, 1] as const
