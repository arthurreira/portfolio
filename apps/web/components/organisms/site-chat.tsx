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
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: CHAT_API_URL,
      body: { locale },
    }),
  })

  const isBusy = status === "submitted" || status === "streaming"

  // A blank chat gives no clue what it knows about — these do.
  const suggestions = t.raw("suggestions") as string[]

  // Escape closes the panel — a dialog primitive would have done this for us.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  // On open the composer takes focus (see its autoFocus prop) so the panel is
  // ready to type in. Here we only handle the return trip, guarded so it never
  // steals focus on first mount.
  useEffect(() => {
    if (!isOpen && wasOpen.current) triggerRef.current?.focus()
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
              role="dialog"
              aria-label={t("title")}
              id={panelId}
              className="flex h-[min(70svh,32rem)] w-[calc(100vw-2.5rem)] flex-col gap-0 shadow-2xl sm:w-96"
            >
              <CardHeader className="border-b">
                <CardTitle>{t("title")}</CardTitle>
                {/* CardAction is the header's dedicated slot — it drives the
                    grid columns, which a hand-rolled flex row would override. */}
                <CardAction>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("close")}
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon />
                  </Button>
                </CardAction>
              </CardHeader>

              <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
                {/* No scrollAnchor here on purpose. Anchoring lifts each new
                    turn to the top so a long answer can be read from its start
                    — good on a full page, wrong in a 32rem panel, where it
                    pushes the streaming reply out of sight. This panel wants
                    the plain chat behaviour: follow the bottom edge. */}
                <MessageScrollerProvider autoScroll>
                  <MessageScroller>
                    {/* The site runs Lenis in root mode, which takes over wheel
                        events for the whole document — without this the panel
                        cannot scroll and the page behind it moves instead. */}
                    <MessageScrollerViewport data-lenis-prevent>
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
                              <EmptyContent className="flex flex-col gap-2">
                                {suggestions.map((question) => (
                                  <Button
                                    key={question}
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      sendMessage({ text: question })
                                    }
                                  >
                                    {question}
                                  </Button>
                                ))}
                              </EmptyContent>
                            </Empty>
                          </MessageScrollerItem>
                        )}

                        {messages.map((message, index) => (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                          >
                            <ChatMessage
                              message={message}
                              // Only the newest reply, and only once it has
                              // finished — mid-stream suggestions would jump.
                              showFollowups={
                                !isBusy && index === messages.length - 1
                              }
                              onFollowup={(question) =>
                                sendMessage({ text: question })
                              }
                            />
                          </MessageScrollerItem>
                        ))}

                        {status === "submitted" && (
                          <MessageScrollerItem messageId="pending">
                            <Marker role="status">
                              <MarkerIcon>
                                <Spinner />
                              </MarkerIcon>
                              <MarkerContent className="shimmer">
                                {t("thinking")}
                              </MarkerContent>
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

              <CardFooter>
                <ChatComposer
                  onSend={(text) => sendMessage({ text })}
                  onStop={stop}
                  isBusy={isBusy}
                  placeholder={t("placeholder")}
                  sendLabel={t("send")}
                  stopLabel={t("stop")}
                  autoFocus
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
