"use client"

import { cn } from "@arthurreira/ui"
import { SEGMENT_STAGGER_S } from "@/lib/motion"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { RotatingWord } from "@/components/molecules/rotating-word"

const ACTION_HOLD_MS = 1600
const NORDCLOUD_URL = "https://nordcloud.com/"

interface HeroTextProps {
  firstName: string
  lastName: string
  titleLine: string
  actionLead: string
  actions: string[]
  actionBeforeCompany: string
  companyLabel: string
  actionAfterCompany: string
  className?: string
}

/** Delay (s) between each segment of the heading starting to decode. */

/** Hero heading — the name decodes out of noise on load, segment by segment. */
export function HeroText({
  firstName,
  lastName,
  titleLine,
  actionLead,
  actions,
  actionBeforeCompany,
  companyLabel,
  actionAfterCompany,
  className,
}: HeroTextProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)}>
      {/* The name and nothing else, on the same two lines the about page uses.
          The cycling greeting used to own the first line, so the largest type
          on the site was a word that changed every couple of seconds rather
          than the one thing a visitor is here to read. */}
      <h1 className="text-hero">
        <span className="block">
          <ScrambleText text={firstName} className="text-foreground" />
        </span>
        <span className="block">
          <ScrambleText
            text={lastName}
            delay={SEGMENT_STAGGER_S}
            className="text-primary"
          />
        </span>
      </h1>

      <div className="max-w-measure flex flex-col gap-2">
        <p className="text-lead text-foreground">{titleLine}</p>
        <p className="text-lead text-muted-foreground">
          {actionLead && <>{actionLead} </>}
          <span className="text-primary">
            <RotatingWord
              words={actions}
              holdMs={ACTION_HOLD_MS}
              cycles={1}
              reserveWidth={false}
            />
          </span>{" "}
          {actionBeforeCompany}{" "}
          <a
            href={NORDCLOUD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
          >
            {companyLabel}
          </a>
          {actionAfterCompany}
        </p>
      </div>
    </div>
  )
}
