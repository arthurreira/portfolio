import Link from "next/link"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { useLocale } from "next-intl"

import { StreamedWords } from "@/components/features/chat/streamed-words"
import { linkifyProjects } from "@/lib/project-links"

/** Renders the assistant's markdown. */
const components: Components = {
  p: ({ children }) => (
    <p>
      <StreamedWords>{children}</StreamedWords>
    </p>
  ),

  li: ({ children }) => (
    <li>
      <StreamedWords>{children}</StreamedWords>
    </li>
  ),

  a: ({ children, href }) =>
    // Internal project links (inserted by linkifyProjects, already locale-
    // prefixed) navigate in-tab; anything external stays untrusted and opens in
    // a new tab with no opener reference.
    href?.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
}

export function ChatMarkdown({ children }: { children: string }) {
  const locale = useLocale()

  return (
    <div className="typeset typeset-chat">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {linkifyProjects(children, locale)}
      </Markdown>
    </div>
  )
}
