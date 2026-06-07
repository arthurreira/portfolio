import type { SVGProps } from "react"

// Full-bleed flags use `slice` so they cover the viewport without distortion.
const COVER = "xMidYMid slice"

export function FinnishFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 11" preserveAspectRatio={COVER} xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="18" height="11" fill="#ffffff" />
      <rect x="4" width="2.5" height="11" fill="#003580" />
      <rect y="4" width="18" height="2.5" fill="#003580" />
    </svg>
  )
}

export function BrazilFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 14" preserveAspectRatio={COVER} xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="20" height="14" fill="#009c3b" />
      <polygon points="10,1 19,7 10,13 1,7" fill="#ffdf00" />
      <circle cx="10" cy="7" r="3" fill="#002776" />
    </svg>
  )
}

/** Full-bleed flag for the transition overlay. */
export function FlagFill({ flag }: { flag: string }) {
  const className = "block h-full w-full"
  return flag === "suomi" ? (
    <FinnishFlag className={className} />
  ) : (
    <BrazilFlag className={className} />
  )
}

/**
 * Small fixed-ratio flag for the nav pills. Inline width/height override the
 * pill's default square SVG sizing so the flag keeps its rectangular shape.
 */
export function FlagChip({ flag }: { flag: string }) {
  const Flag = flag === "suomi" ? FinnishFlag : BrazilFlag
  return <Flag className="rounded-[1px]" style={{ width: "1.125rem", height: "0.75rem" }} />
}
