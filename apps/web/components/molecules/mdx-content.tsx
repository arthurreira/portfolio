'use client'

import { useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'
import { motion } from 'motion/react'
import { revealMotionProps } from '@/components/molecules/reveal'

const FONT = "var(--font-ui)"

/** MDX blocks reveal on scroll and re-hide scrolling up (matches the page). */
const reveal = () => revealMotionProps(0, 12, false)

/* Kept in both variants: the amber uppercase label is a signature of the site,
   and images and rules are structure rather than typography. */
const shared = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <motion.h2 {...reveal()} style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--primary)", margin: 0, marginTop: "2.5rem", marginBottom: "1rem" }}>
      {children}
    </motion.h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <motion.p {...reveal()} style={{ fontFamily: FONT, color: "var(--muted-foreground)", fontSize: "0.875rem", lineHeight: 1.75, margin: 0, marginBottom: "0.75rem" }}>
      {children}
    </motion.p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <motion.li {...reveal()} style={{ borderTop: "1px solid var(--border)", padding: "0.75rem 0", fontSize: "0.875rem", color: "var(--muted-foreground)", fontFamily: FONT }}>
      {children}
    </motion.li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ fontWeight: 600, color: "var(--foreground)" }}>{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--foreground)", textDecoration: "underline", textUnderlineOffset: 3 }}>
      {children}
    </a>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <motion.img
      {...reveal()}
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        border: "1px solid var(--border)",
        background: "var(--muted)",
        margin: "1.5rem 0",
      }}
    />
  ),
  hr: () => <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0.75rem 0" }} />,
}

/**
 * Body typography lives in inline styles here, which beat any stylesheet — so
 * a `.typeset` wrapper has no effect until these are gone. This variant keeps
 * the scroll reveal but drops the styling, letting typeset own the prose.
 */
const { strong: _strong, a: _a, ...structural } = shared

const typesetComponents = {
  ...structural,
  p: ({ children }: { children?: React.ReactNode }) => (
    <motion.p {...reveal()}>{children}</motion.p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => <ul>{children}</ul>,
  li: ({ children }: { children?: React.ReactNode }) => (
    <motion.li {...reveal()}>{children}</motion.li>
  ),
}

type MdxComponents = typeof shared | typeof typesetComponents

type MdxComponent = React.ComponentType<{ components: MdxComponents }>

/** Evaluates the Velite-compiled MDX bundle. Returns null (and logs) on failure. */
function evaluateMdx(code: string): MdxComponent | null {
  try {
    const fn = new Function(code)
    const { default: Component } = fn(runtime)
    return Component ?? null
  } catch (error) {
    console.error("[MdxContent] Failed to evaluate MDX bundle:", error)
    return null
  }
}

export function MdxContent({
  code,
  variant = "standalone",
}: {
  code: string
  /** `typeset` strips body typography so a `.typeset` ancestor can style it. */
  variant?: "standalone" | "typeset"
}) {
  const Component = useMemo(() => evaluateMdx(code), [code])
  if (!Component) return null
  // Component identity is stable — memoized on `code` above; the rule can't
  // see through useMemo. Velite MDX bundles must be evaluated at render time.
  // eslint-disable-next-line react-hooks/static-components
  return (
    <Component
      components={variant === "typeset" ? typesetComponents : shared}
    />
  )
}
