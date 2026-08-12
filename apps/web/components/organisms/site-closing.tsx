"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@arthurreira/ui"
import { OPEN_CHAT_EVENT } from "@/components/features/chat/chat-events"

/**
 * The close. The page used to end on a certification list and then the footer,
 * so a visitor who read the whole thing was never asked for anything.
 *
 * Two actions, deliberately unequal: contact is the primary and the only
 * filled accent on the page; the chat is the back-up the conversions deck
 * describes — the thing that catches the visitor who was not convinced enough
 * to click the first one. That widget already existed; it just was not wired
 * to anything that treats it as a conversion path.
 */
export function SiteClosing() {
  const t = useTranslations("home")

  return (
    <section className="pt-section">
      <h2 className="text-display max-w-measure text-foreground">
        {t("closingHeading")}
      </h2>

      <p className="text-lead mt-block max-w-measure text-muted-foreground">
        {t("closingLead")}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/contact">{t("closingCta")}</Link>
        </Button>

        <Button
          variant="ghost"
          onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
        >
          {t("closingChatCta")}
        </Button>
      </div>
    </section>
  )
}
