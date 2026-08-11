"use client"

import { useTranslations } from "next-intl"
import { ContactLink } from "@/components/atoms/contact-link"
import { ScrambleText } from "@/components/molecules/scramble-text"

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
    <div className="t-shell pt-16 pb-24">
      {/* Was min-h-screen with justify-between, which pinned the response
          time to the bottom of the viewport. There is a real footer under
          this now, so the page just ends where its content ends. */}
      <h1 className="text-display mb-4">
        <ScrambleText text={t("heading1")} className="text-foreground" />{" "}
        <ScrambleText
          text={t("heading2")}
          delay={0.12}
          className="text-primary"
        />
      </h1>

      <p className="text-lead mb-12 max-w-measure text-muted-foreground">
        {t("openTo")}
      </p>

      <div>
        {LINKS.map(({ key, value, href }) => (
          <ContactLink key={key} label={t(key)} value={value} href={href} />
        ))}
        <div className="border-t border-border" />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{t("responseTime")}</p>
    </div>
  )
}
