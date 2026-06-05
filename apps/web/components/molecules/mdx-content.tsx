'use client'

import * as runtime from 'react/jsx-runtime'

const FONT = "var(--font-ui)"

const components = {
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
  hr: () => <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0.75rem 0" }} />,
}

export function TestMDXContent({ code }: { code: string }) {
  try {
    const fn = new Function(code)
    const { default: Component } = fn(runtime)
    return <Component components={components} />
  } catch {
    return null
  }
}
