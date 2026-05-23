"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { ArrowClockwise } from "@phosphor-icons/react"
import { Button, Skeleton } from "@arthurreira/ui"
import { PageHeader } from "@arthurreira/ui/client"

const SAMPLE = {
  label: "Total reach",
  meta: "Last 30 days",
  value: 12847,
  delta: "+18.2%",
  spark: [12, 18, 14, 22, 19, 28, 24, 31, 27, 36, 33, 41],
}

// ─── KPI shell ───────────────────────────────────────────────────────────────

type KpiProps = {
  children: React.ReactNode
  tick: number
  sub?: string
  delta?: string
  label?: string
  deltaDelay?: number
}

function Kpi({
  children,
  tick,
  sub = SAMPLE.meta,
  delta = SAMPLE.delta,
  label = SAMPLE.label,
  deltaDelay = 1.2,
}: KpiProps) {
  return (
    <div className="flex min-h-48 flex-col justify-between rounded-sm border border-border bg-background p-5 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="grid gap-4">
        <div className="min-h-16 text-5xl font-semibold leading-none text-foreground sm:text-6xl">
          {children}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="text-muted-foreground">{sub}</span>
        <motion.span
          key={tick}
          className="font-semibold text-emerald-600 dark:text-emerald-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: deltaDelay, duration: 0.3 }}
        >
          {delta}
        </motion.span>
      </div>
    </div>
  )
}

// ─── Spark bars ──────────────────────────────────────────────────────────────

type SparkProps = { tick: number; accent?: string; delay?: number }

function SparkMotion({ tick, accent = "oklch(0.72 0.18 155)", delay = 0 }: SparkProps) {
  const max = Math.max(...SAMPLE.spark)
  return (
    <div className="mt-4 flex h-12 items-end gap-1.5">
      {SAMPLE.spark.map((v, i) => (
        <motion.i
          key={`${tick}-${i}`}
          className="block w-full rounded-t-[2px]"
          style={{ background: accent }}
          initial={{ height: "0%" }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: delay + i * 0.045, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        />
      ))}
    </div>
  )
}

// ─── Demo card ───────────────────────────────────────────────────────────────

function DemoCard({
  title,
  kicker,
  idx,
  children,
}: {
  title: string
  kicker: string
  idx: number
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-3 rounded-sm border border-border bg-card p-3 text-card-foreground">
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-xs font-semibold text-muted-foreground">
          {String(idx).padStart(2, "0")}
        </span>
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{kicker}</span>
      </div>
      <h3 className="px-1 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

// ─── 1. Count Up ─────────────────────────────────────────────────────────────

function CountUp({ tick }: { tick: number }) {
  const count = useMotionValue(0)
  const formatted = useTransform(count, (v) => Math.round(v).toLocaleString("en-US"))

  useEffect(() => {
    count.set(0)
    const controls = animate(count, SAMPLE.value, { duration: 1.7, ease: [0.33, 1, 0.68, 1] })
    return controls.stop
  }, [tick, count])

  return (
    <Kpi tick={tick}>
      <motion.span className="font-mono tabular-nums">{formatted}</motion.span>
      <SparkMotion tick={tick} />
    </Kpi>
  )
}

// ─── 2. Odometer ─────────────────────────────────────────────────────────────

// 31-digit reel lets us land on any digit at index target+20, scrolling through 2 full loops
const REEL = Array.from({ length: 31 }, (_, i) => i % 10)

function OdometerDigit({
  target,
  staggerIdx,
  tick,
}: {
  target: number
  staggerIdx: number
  tick: number
}) {
  return (
    <span className="odo-col">
      <motion.span
        key={tick}
        className="odo-reel"
        initial={{ y: 0 }}
        animate={{ y: `-${(target + 20) * 1.05}em` }}
        transition={{ delay: staggerIdx * 0.06, duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {REEL.map((x, j) => (
          <span key={j} className="odo-digit">
            {x}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

function Odometer({ tick }: { tick: number }) {
  const digits = useMemo(() => SAMPLE.value.toLocaleString("en-US").split(""), [])

  return (
    <Kpi tick={tick} deltaDelay={1.5}>
      <span className="odo inline-flex font-serif tabular-nums">
        {digits.map((d, i) => {
          if (!/\d/.test(d)) {
            return (
              <span key={`sep-${i}`} className="odo-sep">
                {d}
              </span>
            )
          }
          return (
            <OdometerDigit
              key={`digit-${i}`}
              target={Number.parseInt(d, 10)}
              staggerIdx={i}
              tick={tick}
            />
          )
        })}
      </span>
      <SparkMotion tick={tick} accent="oklch(0.68 0.18 245)" />
    </Kpi>
  )
}

// ─── 3. Mask Rise ────────────────────────────────────────────────────────────

const charVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: "0%", opacity: 1 },
}

function MaskRise({ tick }: { tick: number }) {
  const chars = SAMPLE.value.toLocaleString("en-US").split("")

  return (
    <Kpi tick={tick}>
      <motion.span
        key={tick}
        className="inline-flex font-serif tabular-nums"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.06 }}
      >
        {chars.map((c, i) => (
          <span key={i} className="block overflow-hidden leading-none">
            <motion.span
              className="inline-block"
              variants={charVariants}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {c}
            </motion.span>
          </span>
        ))}
      </motion.span>
      <SparkMotion tick={tick} accent="oklch(0.74 0.16 80)" />
    </Kpi>
  )
}

// ─── 4. Skeleton Morph ───────────────────────────────────────────────────────

function SkeletonMorph({ tick }: { tick: number }) {
  const [showNum, setShowNum] = useState(false)

  useEffect(() => {
    const reset = setTimeout(() => setShowNum(false), 0)
    const show = setTimeout(() => setShowNum(true), 1100)
    return () => {
      clearTimeout(reset)
      clearTimeout(show)
    }
  }, [tick])

  return (
    <Kpi tick={tick} deltaDelay={1.8}>
      <div className="relative flex min-h-16 min-w-56 items-center">
        <motion.div
          className="absolute h-12 w-52 origin-left"
          animate={{ opacity: showNum ? 0 : 1, scaleX: showNum ? 0.6 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Skeleton className="h-full w-full" />
        </motion.div>
        <motion.span
          className="relative font-serif tabular-nums"
          animate={{ opacity: showNum ? 1 : 0, y: showNum ? 0 : 12 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        >
          {SAMPLE.value.toLocaleString("en-US")}
        </motion.span>
      </div>
      <SparkMotion tick={tick} accent="oklch(0.62 0.19 25)" delay={0.8} />
    </Kpi>
  )
}

// ─── 5. Blur Sharpen ─────────────────────────────────────────────────────────

function BlurSharpen({ tick }: { tick: number }) {
  return (
    <Kpi tick={tick}>
      <motion.span
        key={tick}
        className="inline-block origin-left font-serif tabular-nums"
        initial={{ filter: "blur(18px)", opacity: 0, scale: 0.92 }}
        animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1] }}
      >
        {SAMPLE.value.toLocaleString("en-US")}
      </motion.span>
      <SparkMotion tick={tick} accent="oklch(0.67 0.18 300)" />
    </Kpi>
  )
}

// ─── 6. Typewriter ───────────────────────────────────────────────────────────

function Typewriter({ tick }: { tick: number }) {
  const full = SAMPLE.value.toLocaleString("en-US")
  const count = useMotionValue(0)
  const text = useTransform(count, (v) => full.slice(0, Math.floor(v)))

  useEffect(() => {
    count.set(0)
    const controls = animate(count, full.length, { duration: 1.8, ease: "linear" })
    return controls.stop
  }, [tick, full, count])

  return (
    <Kpi tick={tick} deltaDelay={1.6}>
      <span className="font-mono tabular-nums">
        <motion.span>{text}</motion.span>
        <motion.span
          key={tick}
          className="inline-block text-primary"
          animate={{ opacity: [1, 0, 1, 0, 0] }}
          transition={{ duration: 1.9, times: [0, 0.25, 0.5, 0.85, 1], ease: "linear" }}
        >
          |
        </motion.span>
      </span>
      <SparkMotion tick={tick} accent="oklch(0.76 0.17 130)" />
    </Kpi>
  )
}

// ─── Registry ────────────────────────────────────────────────────────────────

const demos = [
  { title: "Count Up", kicker: "Ease counter", Component: CountUp },
  { title: "Odometer", kicker: "Rolling digits", Component: Odometer },
  { title: "Mask Rise", kicker: "Character mask", Component: MaskRise },
  { title: "Skeleton Morph", kicker: "Load to value", Component: SkeletonMorph },
  { title: "Blur Sharpen", kicker: "Focus reveal", Component: BlurSharpen },
  { title: "Typewriter", kicker: "Typed digits", Component: Typewriter },
]

export default function Page() {
  const [tick, setTick] = useState(0)

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-6 sm:px-8 md:px-10 lg:px-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <PageHeader title="Number Reveal" className="mb-2" />
          <p className="max-w-2xl text-sm text-muted-foreground">
            KPI animation primitives — rewritten with Motion.
          </p>
        </div>
        <Button
          className="h-9 w-fit gap-2"
          onClick={() => setTick((t) => t + 1)}
          type="button"
        >
          <ArrowClockwise className="size-4" weight="bold" />
          Replay
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demos.map(({ title, kicker, Component }, index) => (
          <DemoCard key={title} title={title} kicker={kicker} idx={index + 1}>
            <Component tick={tick} />
          </DemoCard>
        ))}
      </div>

      <style jsx global>{`
        .odo {
          height: 1em;
          overflow: hidden;
          line-height: 1;
        }
        .odo-col {
          display: inline-block;
          height: 1em;
          overflow: hidden;
          vertical-align: top;
          width: 0.62em;
        }
        .odo-reel {
          display: flex;
          flex-direction: column;
          will-change: transform;
        }
        .odo-digit {
          display: block;
          height: 1.05em;
          line-height: 1.05em;
        }
        .odo-sep {
          display: inline-block;
          width: 0.32em;
        }
      `}</style>
    </main>
  )
}
