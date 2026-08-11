import { cn } from "@arthurreira/ui"

interface RollingTextProps {
  text: string
  className?: string
  /** Per-letter hover stagger (ms), left to right. */
  staggerMs?: number
}

/**
 * Letter-roll hover — each letter slides up out of a clipped line while an
 * accent-colored copy rolls in from below, staggered across the word (and
 * rolls back on leave).
 */
export function RollingText({
  text,
  className,
  staggerMs = 15,
}: RollingTextProps) {
  return (
    <span className={cn("inline-flex", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="group/roll inline-flex overflow-hidden">
        {Array.from(text).map((char, i) => (
          <span
            key={`${char}-${i}`}
            className="relative inline-block transition-transform duration-300 ease-out group-hover/roll:-translate-y-full"
            style={{ transitionDelay: `${i * staggerMs}ms` }}
          >
            <span className="block">{char === " " ? " " : char}</span>
            <span className="absolute top-full left-0 block text-primary">
              {char === " " ? " " : char}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
