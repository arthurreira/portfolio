/** Number of timed advances needed to show a finite number of sequences. */
export function getRotationAdvanceLimit(
  wordCount: number,
  cycles?: number
): number | undefined {
  if (cycles === undefined) return undefined

  return Math.max(0, Math.floor(cycles) * Math.max(0, wordCount) - 1)
}
