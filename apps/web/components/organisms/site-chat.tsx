"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useLocale, useTranslations } from "next-intl"
import { ChatsCircleIcon } from "@phosphor-icons/react"
import {
  Button,
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@arthurreira/ui/client"

import { ChatComposer } from "@/components/molecules/chat-composer"
import { ChatMessage } from "@/components/molecules/chat-message"

const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? "http://127.0.0.1:8787/chat"

/**
 * The portfolio chat, as a floating panel.
 *
 * It rides along on every page rather than living at its own route: the
 * question ("what did he build with X?") occurs while reading a project, so
 * the answer has to be reachable from there without navigating away.
 *
 * Nothing is persisted — messages live in `useChat` state and are gone on
 * reload, which is the whole privacy story for this feature.
 *
 * The Worker speaks the AI SDK UI Message Stream protocol, so the default
 * transport works as-is, with no custom parsing on this side.
 */
export function SiteChat() {
  const t = useTranslations("chat")
  const locale = useLocale()

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: CHAT_API_URL,
      body: { locale },
    }),
  })

  const isBusy = status === "submitted" || status === "streaming"

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          aria-label={t("open")}
          className="fixed right-5 bottom-5 z-50 rounded-full"
        >
          <ChatsCircleIcon />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-4 sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        <MessageScrollerProvider autoScroll scrollPreviousItemPeek={64}>
          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent aria-busy={isBusy} className="px-4">
                {messages.length === 0 && (
                  // Every direct child of the content must be an Item, or the
                  // scroller cannot measure and anchor it.
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

        <div className="px-4 pb-4">
          <ChatComposer
            onSend={(text) => sendMessage({ text })}
            isBusy={isBusy}
            placeholder={t("placeholder")}
            sendLabel={t("send")}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
