"use client"

import { useTranslations } from "next-intl"

const FONT = "var(--font-ui)"

const LINKS = [
  { label: "arthur.ferreiramiran@gmail.com", href: "mailto:arthur.ferreiramiran@gmail.com" },
  { label: "GitHub",   href: "https://github.com/arthurreira"          },
  { label: "LinkedIn", href: "https://linkedin.com/in/arthurferreira00" },
]

export function SiteContact() {
  const t = useTranslations("contact")

  return (
    <div className="t-shell" style={{
      background: "var(--background)", minHeight: "100vh", fontFamily: FONT,
      paddingLeft: "calc(var(--sidebar-w) + var(--ticker-gap))", paddingRight: "var(--gutter)",
      paddingTop: "3rem", paddingBottom: 0,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div>
        <h1 style={{
          fontWeight: 900, fontSize: "clamp(3rem, 11.5vw, 11.5rem)",
          lineHeight: 0.92, letterSpacing: "-0.045em", margin: 0, marginBottom: "1.5rem",
        }}>
          <span style={{ color: "var(--foreground)" }}>{t("heading1")} </span>
          <span style={{ color: "var(--primary)" }}>{t("heading2")}</span>
        </h1>

        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0, marginBottom: "4rem" }}>
          {t("openTo")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              style={{
                color: "var(--foreground)", fontWeight: 700,
                fontSize: "clamp(1.25rem, 3vw, 2rem)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "1rem",
                padding: "0.5rem 0", transition: "color 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)" }}
            >
              {label}
              <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>→</span>
            </a>
          ))}
        </div>
      </div>

      <div style={{ paddingBottom: "3rem" }}>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
          {t("responseTime")}
        </p>
        <div style={{ height: 1, background: "var(--border)" }} />
      </div>
    </div>
  )
}
