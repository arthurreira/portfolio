// Official flag artwork lives in /public/images/flags — rendered as CSS
// backgrounds with `cover` so the flags always fill their box edge-to-edge
// (crops instead of distorting, like preserveAspectRatio "slice").
const BRASIL_SRC = "/images/flags/Flag_of_Brazil.svg"
const SUOMI_SRC = "/images/flags/Flag_of_Finland.svg"

function flagSrc(flag: string): string {
  return flag === "suomi" ? SUOMI_SRC : BRASIL_SRC
}

/** Full-bleed flag for the theme-change circle-reveal overlay. */
export function FlagFill({ flag }: { flag: string }) {
  return (
    <div
      className="h-full w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${flagSrc(flag)})` }}
    />
  )
}

/** Flag that fills an entire p-0 nav pill edge-to-edge (no padding box). */
export function FlagPillFill({ flag }: { flag: string }) {
  return (
    <div
      className="bg-cover bg-center"
      style={{
        width: "1.75rem",
        height: "1.125rem",
        backgroundImage: `url(${flagSrc(flag)})`,
      }}
    />
  )
}
