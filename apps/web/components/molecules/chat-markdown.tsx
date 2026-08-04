import Link from "next/link"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { useLocale } from "next-intl"

import { linkifyProjects } from "@/lib/project-links"

/**
 * Renders the assistant's markdown.
 *
 * The model answers with bold, lists and links; rendered as plain text those
 * show up as literal `**` and `-`. Every element is styled here rather than
 * inherited, so the output stays readable in a narrow panel.
 *
 * `bg-muted` is only 5% opacity in these themes, so code uses a
 * foreground-derived tint instead — faint backgrounds vanish on the card.
 */
const components: Components = {
  p: ({ children }) => <p className="not-first:mt-2">{children}</p>,

  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),

  ul: ({ children }) => (
    <ul className="flex list-disc flex-col gap-1 ps-4 not-first:mt-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="flex list-decimal flex-col gap-1 ps-4 not-first:mt-2">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="ps-0.5">{children}</li>,

  a: ({ children, href }) =>
    // Internal project links (inserted by linkifyProjects, already
    // locale-prefixed) navigate in-tab; anything external stays untrusted and
    // opens in a new tab with no opener reference.
    href?.startsWith("/") ? (
      <Link
        href={href}
        className="underline underline-offset-2 hover:text-foreground"
      >
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        {children}
      </a>
    ),

  code: ({ children }) => (
    <code className="rounded-none bg-foreground/10 px-1 py-0.5 font-mono text-[0.95em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-none bg-foreground/10 p-2 not-first:mt-2">
      {children}
    </pre>
  ),

  // Headings are rare in a chat reply; keep them close to body size.
  h1: ({ children }) => (
    <p className="font-semibold text-foreground not-first:mt-3">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="font-semibold text-foreground not-first:mt-3">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="font-semibold text-foreground not-first:mt-3">{children}</p>
  ),
}

export function ChatMarkdown({ children }: { children: string }) {
  const locale = useLocale()

  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {linkifyProjects(children, locale)}
    </Markdown>
  )
}
