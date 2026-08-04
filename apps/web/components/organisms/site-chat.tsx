"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useLocale, useTranslations } from "next-intl"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { ChatsCircleIcon, XIcon } from "@phosphor-icons/react"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Marker,
  MarkerContent,
  MarkerIcon,
  Spinner,
} from "@arthurreira/ui"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@arthurreira/ui/client"

import { ChatComposer } from "@/components/molecules/chat-composer"
import { ChatMessage } from "@/components/molecules/chat-message"

const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? "http://127.0.0.1:8787/chat"

const MotionCard = motion.create(Card)

/** Grows out of the launcher button rather than just fading in. */
const PANEL_MOTION = {
  initial: { opacity: 0, scale: 0.94, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
  transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] as const },
}

/**
 * The portfolio chat, as a floating card.
 *
 * Deliberately *not* a modal sheet: the question ("what did he build with X?")
 * occurs while reading a project, so the page has to stay readable and
 * clickable behind the panel. A Card gives that for free — no overlay.
 *
 * The tradeoff is that a dialog component would have handled Escape and focus
 * for us, so both are wired up by hand below.
 *
 * Nothing is persisted: messages live in `useChat` state and are gone on
 * reload, which is the whole privacy story for this feature.
 */
export function SiteChat() {
  const t = useTranslations("chat")
  const locale = useLocale()
  const panelId = useId()

  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: CHAT_API_URL,
      body: { locale },
    }),
  })

  const isBusy = status === "submitted" || status === "streaming"

  // Escape closes the panel — a dialog primitive would have done this for us.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  // Move focus into the panel on open and back to the trigger on close, but
  // never on first mount — that would steal focus on every page load.
  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
    else if (wasOpen.current) triggerRef.current?.focus()
    wasOpen.current = isOpen
  }, [isOpen])

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <MotionCard
              {...PANEL_MOTION}
              // Scale from the launcher below it, not from the middle.
              style={{ transformOrigin: "bottom right" }}
              ref={panelRef}
              role="dialog"
              aria-label={t("title")}
              id={panelId}
              tabIndex={-1}
              className="flex h-[min(70svh,32rem)] w-[calc(100vw-2.5rem)] flex-col gap-0 shadow-2xl sm:w-96"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <CardTitle>{t("title")}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("close")}
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon />
                </Button>
              </CardHeader>

              <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
                <MessageScrollerProvider autoScroll scrollPreviousItemPeek={64}>
                  <MessageScroller>
                    <MessageScrollerViewport>
                      <MessageScrollerContent
                        aria-busy={isBusy}
                        className="p-4"
                      >
                        {messages.length === 0 && (
                          // Every direct child of the content must be an Item, or
                          // the scroller cannot measure and anchor it.
                          <MessageScrollerItem messageId="empty">
                            <Empty>
                              <EmptyHeader>
                                <EmptyMedia variant="icon">
                                  <ChatsCircleIcon />
                                </EmptyMedia>
                                <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
                                <EmptyDescription>
                                  {t("emptyDescription")}
                                </EmptyDescription>
                              </EmptyHeader>
                            </Empty>
                          </MessageScrollerItem>
                        )}

                        {messages.map((message) => (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            // Anchor each question so its answer streams in below it.
                            scrollAnchor={message.role === "user"}
                          >
                            <ChatMessage message={message} />
                          </MessageScrollerItem>
                        ))}

                        {status === "submitted" && (
                          <MessageScrollerItem messageId="pending">
                            <Marker role="status">
                              <MarkerIcon>
                                <Spinner />
                              </MarkerIcon>
                              <MarkerContent>{t("thinking")}</MarkerContent>
                            </Marker>
                          </MessageScrollerItem>
                        )}

                        {error && (
                          <MessageScrollerItem messageId="error">
                            <Marker role="status">
                              <MarkerContent>{t("error")}</MarkerContent>
                            </Marker>
                          </MessageScrollerItem>
                        )}
                      </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                  </MessageScroller>
                </MessageScrollerProvider>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <ChatComposer
                  onSend={(text) => sendMessage({ text })}
                  isBusy={isBusy}
                  placeholder={t("placeholder")}
                  sendLabel={t("send")}
                />
              </CardFooter>
            </MotionCard>
          )}
        </AnimatePresence>

        <Button
          ref={triggerRef}
          size="icon"
          aria-label={isOpen ? t("close") : t("open")}
          aria-expanded={isOpen}
          aria-controls={isOpen ? panelId : undefined}
          onClick={() => setIsOpen((open) => !open)}
          className="size-12 rounded-full shadow-lg"
        >
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center"
          >
            {isOpen ? <XIcon /> : <ChatsCircleIcon />}
          </motion.span>
        </Button>
      </div>
    </MotionConfig>
  )
}
