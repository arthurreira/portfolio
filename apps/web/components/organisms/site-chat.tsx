"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useLocale, useTranslations } from "next-intl"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import {
  ArrowCounterClockwiseIcon,
  ChatsCircleIcon,
  LockSimpleIcon,
  XIcon,
} from "@phosphor-icons/react"
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  ChatModelPicker,
  type ModelChoice,
} from "@/components/molecules/chat-model-picker"
import { ChatMessage } from "@/components/molecules/chat-message"
import { ChatTurnstile } from "@/components/molecules/chat-turnstile"
import { useDegraded } from "@/hooks/use-degraded"
import { useTurnstile } from "@/hooks/use-turnstile"

const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? "http://127.0.0.1:8787/chat"

const MotionCard = motion.create(Card)

/** Each turn rises in once; streaming growth inside it is handled in CSS. */
const ITEM_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: "easeOut" as const },
}

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

  const {
    ref: turnstileRef,
    getToken,
    hasFailed: turnstileFailed,
  } = useTurnstile()

  const [model, setModel] = useState<ModelChoice>("claude")
  const { trackingFetch, degradedIds, settle, discard } = useDegraded()

  // Built once rather than on every render. `getToken` reads the widget ref
  // when it runs, which is inside the send handler — not during render.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: CHAT_API_URL,
        // Wrapped only to read the degraded-mode header off the response.
        fetch: trackingFetch,
        // A token is fetched per send rather than once: Turnstile tokens are
        // single-use, so one taken at mount would fail on the second message.
        prepareSendMessagesRequest: async ({ messages, body }) => ({
          body: {
            ...body,
            messages,
            locale,
            turnstileToken: await getToken(),
          },
        }),
      }),
    [locale, getToken, trackingFetch]
  )

  const { messages, sendMessage, setMessages, status, error, stop } =
    useChat({ transport })

  const isBusy = status === "submitted" || status === "streaming"

  // A blank chat gives no clue what it knows about — these do. Grouped because
  // visitors do not expect a portfolio chat to answer anything but technical
  // questions, and the personal half is the part that needs advertising.
  const suggestionGroups = [
    { label: t("suggestionsTechLabel"), items: t.raw("suggestionsTech") },
    {
      label: t("suggestionsPersonalLabel"),
      items: t.raw("suggestionsPersonal"),
    },
  ] as { label: string; items: string[] }[]

  // The Worker marks the response, but the reply it produced does not exist
  // until the turn settles — so the flag is attached once streaming is done.
  useEffect(() => {
    // A failed turn produced no reply to mark, and a flag left held would be
    // misattributed to whatever gets answered next.
    if (status === "error") {
      discard()
      return
    }
    if (status !== "ready") return
    const last = messages.at(-1)
    if (last?.role === "assistant") settle(last.id)
  }, [status, messages, settle, discard])

  // `/` opens the panel. The site already binds d and l, so a single-key
  // shortcut is the established language here rather than a new convention.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      const target = event.target
      // Never steal the key from someone typing — including in this panel.
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return
      }
      event.preventDefault()
      setIsOpen(true)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

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
                {/* The one thing worth saying up front. Every other chat on the
                    web stores your messages; this one does not, and a visitor
                    has no way to know that unless it is stated. */}
                <CardDescription className="flex flex-col gap-0.5 text-xs">
                  <span
                    className="flex items-center gap-1.5"
                    title={t("metaPrivateHint")}
                  >
                    <LockSimpleIcon className="size-3.5 shrink-0" aria-hidden />
                    {t("metaPrivate")}
                    <span aria-hidden>·</span>
                    {model === "claude" ? t("modelClaude") : t("modelFree")}
                  </span>
                  <span>{t("metaScope")}</span>
                </CardDescription>
                {/* CardAction is the header's dedicated slot — it drives the
                    grid columns, which a hand-rolled flex row would override. */}
                <CardAction className="flex items-center gap-1">
                  {/* Nothing is persisted, so "start over" is a real state here
                      rather than housekeeping — currently only a page reload
                      achieves it. */}
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("clear")}
                      title={t("clear")}
                      onClick={() => setMessages([])}
                    >
                      <ArrowCounterClockwiseIcon />
                    </Button>
                  )}
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
                            {/* Deliberately not the Empty primitive: it centres
                                its content, and everything else on this site is
                                left-aligned. The header already names the panel,
                                so repeating the title here would say it twice. */}
                            <div className="flex flex-col items-start gap-4">
                              <p className="text-muted-foreground text-sm text-pretty">
                                {t("emptyDescription")}
                              </p>
                              {suggestionGroups.map((group) => (
                                <div
                                  key={group.label}
                                  className="flex w-full flex-col items-stretch gap-1.5"
                                >
                                  <p className="text-muted-foreground text-xs font-medium">
                                    {group.label}
                                  </p>
                                  {group.items.map((question) => (
                                    <Button
                                      key={question}
                                      variant="outline"
                                      size="sm"
                                      className="h-auto justify-start py-1.5 text-left whitespace-normal"
                                      onClick={() =>
                                        sendMessage(
                                          { text: question },
                                          { body: { model } }
                                        )
                                      }
                                    >
                                      {question}
                                    </Button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </MessageScrollerItem>
                        )}

                        {messages.map((message, index) => (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                          >
                            <motion.div {...ITEM_MOTION}>
                              <ChatMessage
                                message={message}
                              // Only the newest reply, and only once it has
                              // finished — mid-stream suggestions would jump.
                                showFollowups={
                                  !isBusy && index === messages.length - 1
                                }
                                onFollowup={(question) =>
                                  sendMessage(
                                    { text: question },
                                    { body: { model } }
                                  )
                                }
                                isDegraded={degradedIds.has(message.id)}
                                degradedLabel={t("degraded")}
                                copyLabel={t("copy")}
                                copiedLabel={t("copied")}
                              />
                            </motion.div>
                          </MessageScrollerItem>
                        ))}

                        {status === "submitted" && (
                          <MessageScrollerItem messageId="pending">
                            <motion.div {...ITEM_MOTION}>
                              <Marker role="status">
                                <MarkerIcon>
                                  <Spinner />
                                </MarkerIcon>
                                <MarkerContent className="shimmer">
                                  {t("thinking")}
                                </MarkerContent>
                              </Marker>
                            </motion.div>
                          </MessageScrollerItem>
                        )}

                        {error && (
                          <MessageScrollerItem messageId="error">
                            <Marker role="status">
                              {/* A failed bot check is the one error a visitor
                                  can actually do something about, so it says
                                  what happened instead of "try again". */}
                              <MarkerContent>
                                {turnstileFailed
                                  ? t("turnstileFailed")
                                  : t("error")}
                              </MarkerContent>
                            </Marker>
                          </MessageScrollerItem>
                        )}
                      </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                  </MessageScroller>
                </MessageScrollerProvider>
              </CardContent>

              <ChatTurnstile widgetRef={turnstileRef} />

              <CardFooter className="flex-col items-stretch gap-2">
                <div className="self-start">
                  <ChatModelPicker
                    value={model}
                    onChange={setModel}
                    disabled={isBusy}
                  />
                </div>
                <ChatComposer
                  onSend={(text) => sendMessage({ text }, { body: { model } })}
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
          title={isOpen ? t("close") : t("openHint")}
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
