"use client"

import { useTranslations } from "next-intl"
import { ContactLink } from "@/components/atoms/contact-link"
import { ScrambleText } from "@/components/molecules/scramble-text"
import { RotatingWord } from "@/components/molecules/rotating-word"
import { SEGMENT_STAGGER_S } from "@/lib/motion"

const EMAIL = "arthur.ferreiramiran@gmail.com"

const LINKS = [
  { key: "email", value: EMAIL, href: `mailto:${EMAIL}` },
  {
    key: "github",
    value: "arthurreira",
    href: "https://github.com/arthurreira",
  },
  {
    key: "linkedin",
    value: "arthurferreira00",
    href: "https://linkedin.com/in/arthurferreira00",
  },
] as const

export function SiteContact() {
  const t = useTranslations("contact")

  return (
    <div className="mx-auto max-w-page px-gutter pt-frame pb-frame-end">
      {/* Page edge, like every other page title and like the prose under it.
          The rail is for row meta, not for headings — putting the heading on it
          indented the title while the lead paragraph stayed put, which made the
          page's left edge jagged rather than doubled.
          Each half needs its own block: without them JSX collapses the
          whitespace between adjacent elements and the two words render welded
          together as "Let'sTalk." on one line. */}
      {/* Heading left, secondary right — the shape /projects and /about use.
          The response time was the last line on the page, under the links,
          where nobody deciding whether to write ever reached it. It is the one
          promise the page makes, so it sits with the invitation. */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-display">
          <ScrambleText text={t("heading1")} className="text-foreground" />
          {/* Explicit, not whitespace in the source: JSX drops whitespace
              between adjacent elements when a newline is involved, which is
              what rendered these welded together as "Let'sTalk.". */}
          {" "}
          <ScrambleText
            text={t("heading2")}
            delay={SEGMENT_STAGGER_S}
            className="text-primary"
          />
        </h1>

        <p className="text-sm text-muted-foreground">{t("responseTime")}</p>
      </div>

      <p className="text-lead mb-12 max-w-measure text-muted-foreground">
        {t("openToLead")}{" "}
        <span className="text-foreground">
          <RotatingWord words={t.raw("openToItems") as string[]} />
        </span>
      </p>

      <div>
        {LINKS.map(({ key, value, href }) => (
          <ContactLink key={key} label={t(key)} value={value} href={href} />
        ))}
        <div className="border-t border-border" />
      </div>
    </div>
  )
}
