"use client"

const TICKER_ITEMS = [
  "AWS CLOUD PRACTITIONER",
  "AZURE FUNDAMENTALS",
  "AWS AI CLOUD PRACTITIONER",
  "AZURE AI FUNDAMENTALS",
]

const HALF = Array(10).fill(TICKER_ITEMS).flat()

function TickerItems({ prefix }: { prefix: string }) {
  return (
    <>
      {HALF.map((item, i) => (
        <span key={`${prefix}${i}`}>
          <span className="text-muted-foreground">{item}</span>
          <span className="text-primary"> · </span>
        </span>
      ))}
    </>
  )
}

export function VerticalTicker() {
  return (
    <div
      aria-hidden
      className="t-sidebar fixed left-0 top-0 h-screen overflow-hidden flex justify-center pointer-events-none"
      style={{ width: "clamp(44px, 5vw, 72px)", zIndex: 9999 }}
    >
      {/* rotate wrapper — keeps rotate(180deg) out of the animation */}
      <div className="ticker-wrapper">
        <div className="ticker-track">
          <TickerItems prefix="a" />
          <TickerItems prefix="b" />
        </div>
      </div>

      <style>{`
        @keyframes vertTicker {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  )
}
