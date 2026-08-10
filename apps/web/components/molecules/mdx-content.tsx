'use client'

import { useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'

const FONT = "var(--font-ui)"

/* Kept in both variants: the amber uppercase label is a signature of the site,
   and images and rules are structure rather than typography. */
const shared = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--primary)", margin: 0, marginTop: "2.5rem", marginBottom: "1rem" }}>
      {children}
    </h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ fontFamily: FONT, color: "var(--muted-foreground)", fontSize: "0.875rem", lineHeight: 1.75, margin: 0, marginBottom: "0.75rem" }}>
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ borderTop: "1px solid var(--border)", padding: "0.75rem 0", fontSize: "0.875rem", color: "var(--muted-foreground)", fontFamily: FONT }}>
      {children}
    </li>
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
    <img src={src}
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
 * a `.typeset` wrapper has no effect until these are gone. This variant drops the
 * styling entirely, letting typeset own the prose.
 */
const { strong: _strong, a: _a, ...structural } = shared

const typesetComponents = {
  ...structural,
  p: ({ children }: { children?: React.ReactNode }) => (
    <p>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => <ul>{children}</ul>,
  li: ({ children }: { children?: React.ReactNode }) => (
    <li>{children}</li>
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
  return (
    // eslint-disable-next-line react-hooks/static-components
    <Component
      components={variant === "typeset" ? typesetComponents : shared}
    />
  )
}
