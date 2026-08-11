"use client"

export * from './hooks/useMountedAfter'
export * from './lib/theme-provider'
export * from './components/avatar'
export * from './components/cardGrid'
export * from './components/dialog'
// Not server-safe: button-group imports Separator, which is a client component,
// and index.ts is a barrel — exporting it there dragged that boundary into every
// page that imports anything from the package.
export * from './components/button-group'
export * from './components/input-group'
// Owns scroll state and context — client-only.
export * from './components/message-scroller'
export * from './components/navbar'
// Imports @phosphor-icons/react at the root, which builds an IconContext with
// createContext — so it cannot be exported from the server-safe barrel.
// "use client" (Radix) — belongs here, not in the server-safe barrel.
export * from './components/separator'
export * from './components/pagination'
export * from './components/pageHeader'
export * from './components/popover'
export * from './components/select'
export * from './components/sheet'
export * from './components/themeToggle'
export { ThemeProvider } from "./lib/theme-provider"