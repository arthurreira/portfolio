"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useLocale, useTranslations } from "next-intl"
import { CHAT_CLOSED_EVENT, OPEN_CHAT_EVENT } from "@/components/features/chat/chat-events"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import {
  ArrowCounterClockwiseIcon,
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

import { ChatComposer } from "@/components/features/chat/chat-composer"
import {
  ChatModelPicker,
  type ModelChoice,
} from "@/components/features/chat/chat-model-picker"
import { ChatMessage } from "@/components/features/chat/chat-message"
import { ChatTurnstile } from "@/components/features/chat/chat-turnstile"
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

/** The portfolio chat, as a floating card. */
export function SiteChat() {
  const t = useTranslations("chat")
  const locale = useLocale()
  const panelId = useId()

  const [isOpen, setIsOpen] = useState(false)
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

  // A blank chat gives no clue what it knows about — these do.
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

  // The closing CTA on the home page opens the panel too — the chat is the
  // back-up conversion path, not only a widget you have to find.
  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener(OPEN_CHAT_EVENT, open)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, open)
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
  // ready to type in. On close the panel announces it rather than restoring
  // focus itself — the trigger is in the nav now and is not this component's
  // to reach into.
  useEffect(() => {
    if (!isOpen && wasOpen.current) {
      window.dispatchEvent(new Event(CHAT_CLOSED_EVENT))
    }
    wasOpen.current = isOpen
  }, [isOpen])

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <MotionCard
              {...PANEL_MOTION}
              // Scale from the launcher below it, not from the middle.
              style={{ transformOrigin: "bottom right" }}
              role="dialog"
              aria-label={t("title")}
              id={panelId}
              className="flex h-[min(70svh,32rem)] w-[calc(100vw-2.5rem)] flex-col gap-0 border shadow-sm sm:w-96"
            >
              <CardHeader className="border-b">
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription className="flex flex-col gap-0.5 text-xs">
                  <span
                    className="flex items-center gap-1.5"
                    title={t("metaPrivateHint")}
                  >
                    {t("metaPrivate")}
                    <span aria-hidden>·</span>
                    {model === "claude" ? t("modelClaude") : t("modelFree")}
                  </span>
                  <span>{t("metaScope")}</span>
                </CardDescription>
                <CardAction className="flex items-center gap-1">
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
                <MessageScrollerProvider autoScroll>
                  <MessageScroller>
                    <MessageScrollerViewport data-lenis-prevent>
                      <MessageScrollerContent
                        aria-busy={isBusy}
                        className="p-4"
                      >
                        {messages.length === 0 && (
                          // Every direct child of the content must be an Item,
                          // or
                          // the scroller cannot measure and anchor it.
                          <MessageScrollerItem messageId="empty">
                            <div className="flex flex-col items-start gap-4">
                              <p className="text-muted-foreground text-sm text-pretty">
                                {t("emptyDescription")}
                              </p>
                              {suggestionGroups.map((group) => (
                                <div
                                  key={group.label}
                                  className="flex w-full flex-col gap-1.5"
                                >
                                  <p className="label-caps">{group.label}</p>
                                  <div className="w-full">
                                    {group.items.map((question) => (
                                      <button
                                        key={question}
                                        type="button"
                                        className="w-full border-t border-border py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        onClick={() =>
                                          sendMessage(
                                            { text: question },
                                            { body: { model } }
                                          )
                                        }
                                      >
                                        {question}
                                      </button>
                                    ))}
                                  </div>
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
                    <MessageScrollerButton className="start-auto end-3 translate-x-0 shadow-md rtl:translate-x-0" />
                  </MessageScroller>
                </MessageScrollerProvider>
              </CardContent>

              <ChatTurnstile widgetRef={turnstileRef} />

              <CardFooter>
                <ChatComposer
                  // The picker rides in the composer's button row rather than
                  // a row of its own — one less band of chrome above the field.
                  leading={
                    <ChatModelPicker
                      value={model}
                      onChange={setModel}
                      disabled={isBusy}
                    />
                  }
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

      </div>
    </MotionConfig>
  )
}
