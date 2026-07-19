"use client"

import { useTranslations } from "next-intl"
import { ContactLink } from "@/components/atoms/contact-link"
import { LineReveal } from "@/components/molecules/line-reveal"
import {
  ProximityArea,
  ProximityLetters,
} from "@/components/molecules/proximity-text"

const LINKS = [
  { label: "arthur.ferreiramiran@gmail.com", href: "mailto:arthur.ferreiramiran@gmail.com" },
  { label: "GitHub",   href: "https://github.com/arthurreira"          },
  { label: "LinkedIn", href: "https://linkedin.com/in/arthurferreira00" },
]

export function SiteContact() {
  const t = useTranslations("contact")

  return (
    <div className="t-shell flex min-h-screen flex-col justify-between bg-background pt-12 font-ui">
      <div>
        {/* font-black / leading / tracking come from @layer base h1 */}
        <ProximityArea>
          <h1 className="mb-6 text-[clamp(3rem,11.5vw,11.5rem)]">
            <LineReveal>
              <span className="text-foreground">
                <ProximityLetters text={`${t("heading1")} `} />
              </span>
              <span className="text-primary">
                <ProximityLetters text={t("heading2")} tone="primary" />
              </span>
            </LineReveal>
          </h1>
        </ProximityArea>

        <p className="mb-16 text-sm text-muted-foreground">{t("openTo")}</p>

        <div className="flex flex-col gap-1">
          {LINKS.map(({ label, href }) => (
            <ContactLink key={href} label={label} href={href} />
          ))}
        </div>
      </div>

      <div className="pb-12">
        <p className="mb-6 text-xs text-muted-foreground">{t("responseTime")}</p>
        <div className="h-px bg-border" />
      </div>
    </div>
  )
}
