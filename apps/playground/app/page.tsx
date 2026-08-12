import { SpringBox } from "@/components/spring-box"
import Link from "next/link"

const EXPERIMENTS = [
  { href: "/sortable",       label: "Sortable Cards",   desc: "Drag-and-drop card grid using @dnd-kit",           tags: ["dnd-kit", "motion"] },
  { href: "/cards",          label: "Card Grid",        desc: "Bento-style responsive grid with data categories", tags: ["ui", "grid"]         },
  { href: "/number-reveal",  label: "Number Reveal",    desc: "Animated KPI counter with sparkline",              tags: ["animation", "motion"] },
  { href: "/sdk-test",       label: "Analytics SDK",    desc: "Live request capture for the analytics client",    tags: ["sdk", "websocket"]   },
]

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16 pb-12 space-y-12">

      {/* Header */}
      <div className="space-y-3">
        <p className="font-mono text-xs text-muted-foreground/40 tracking-[0.2em] uppercase select-none">
          {"// playground"}
        </p>
        <h1 className="font-mono font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
          <span className="text-muted-foreground/20 mr-1 select-none">[</span>
          experiments
          <span className="text-muted-foreground/20 ml-1 select-none">]</span>
        </h1>
        <p className="font-mono text-sm text-muted-foreground border-l-2 border-border pl-4">
          <span className="text-muted-foreground/40 select-none">{"// "}</span>
          Where new ideas get tested before they ship. Code on{" "}
          <a
            href="https://github.com/arthurreira/arthurreira"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            GitHub ↗
          </a>
        </p>
      </div>

      {/* Experiment list */}
      <div className="space-y-0 border-t border-border/40">
        {EXPERIMENTS.map((exp, i) => (
          <Link
            key={exp.href}
            href={exp.href}
            className="group flex items-start gap-4 py-4 border-b border-border/40 hover:bg-muted/20 transition-colors duration-150 -mx-2 px-2"
          >
            <span className="font-mono text-xs text-muted-foreground/30 w-8 shrink-0 pt-0.5 tabular-nums select-none">
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="font-mono font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-150">
                {exp.label}
              </p>
              <p className="font-mono text-xs text-muted-foreground/60">
                <span className="text-muted-foreground/30 select-none">{"// "}</span>
                {exp.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exp.tags.map(tag => (
                  <span key={tag} className="font-mono text-[10px] border border-border/50 text-muted-foreground/50 px-1.5 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground/30 shrink-0 pt-0.5 transition-transform duration-150 group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>

      {/* Spring demo */}
      <div className="space-y-3">
        <p className="font-mono text-xs text-muted-foreground/40 tracking-[0.2em] uppercase select-none">
          {"// spring-demo"}
        </p>
        <SpringBox />
      </div>

    </div>
  )
}
