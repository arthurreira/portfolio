"use client"

import { useTranslations } from "next-intl"
import { ContactLink } from "@/components/atoms/contact-link"
import { LineReveal } from "@/components/molecules/line-reveal"

const LINKS = [
  { label: "arthur.ferreiramiran@gmail.com", href: "mailto:arthur.ferreiramiran@gmail.com" },
  { label: "GitHub",   href: "https://github.com/arthurreira"          },
  { label: "LinkedIn", href: "https://linkedin.com/in/arthurferreira00" },
]

export function SiteContact() {
  const t = useTranslations("contact")

  return (
    <div className="t-shell flex min-h-screen flex-col justify-between bg-background pt-12">
      <div>
        {/* font-black / leading / tracking come from @layer base h1 */}
        <h1 className="text-display mb-6">
          <LineReveal>
            <span className="text-foreground">{t("heading1")} </span>
            <span className="text-primary">{t("heading2")}</span>
          </LineReveal>
        </h1>

        <p className="mb-16 text-base text-muted-foreground">{t("openTo")}</p>

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
