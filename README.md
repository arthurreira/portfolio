# arthurreira.dev — Portfolio Monorepo

Personal portfolio, component playground, and published UI library — all in one pnpm workspace.

**Live sites:**

- Portfolio → [arthurreira.dev](https://arthurreira.dev)
- Playground → [playground.arthurreira.dev](https://playground.arthurreira.dev)
- UI Package → [@arthurreira/ui on npm](https://www.npmjs.com/package/@arthurreira/ui)

---

## What's in here

```text
apps/
  web/          → Portfolio site (Next.js 16, Turbopack, next-intl, Velite)
  playground/   → Component playground (Next.js 16, dnd-kit, motion)

packages/
  ui/                   → @arthurreira/ui — published React component library (v0.1.x)
  content/              → @arthurreira/content — MDX content layer (Velite)
  eslint-config/        → shared ESLint config
  typescript-config/    → shared TypeScript config
```

---

## Apps

### `apps/web` — Portfolio

The main portfolio site. Built with:

- **Next.js 16** with Turbopack
- **next-intl** — i18n with English, Finnish, and Brazilian Portuguese (locale-prefixed URLs, `fi` default)
- **Velite** — MDX content pipeline for projects and about page
- **@arthurreira/ui** — design system and components
- **motion** + **Lenis** — the animation and smooth-scrolling layer

Routes: `/`, `/projects`, `/projects/[slug]`, `/about`, `/contact` (all under `/[locale]`)

Components follow atomic design (`atoms/`, `molecules/`, `organisms/`).

**Motion & interaction layer:**

- Lenis smooth scrolling with parallax project rows, scroll progress bar, and an eased back-to-top button
- Scroll reveals that hide on scroll-up and replay — lists, sidebars, and MDX content blocks
- Masked line entrances on the hero and every page heading
- Proximity type effect — letters lift and shift color as the cursor nears them
- Custom cursor (accent dot + trailing spring ring) on fine pointers only
- Motion-driven vertical cert ticker that eases to a stop on hover
- 2×2 theme matrix (Brasil/Suomi × dark/light) with view-transition sweeps; keyboard: `d` toggles mode, `l` cycles language
- Touch and `prefers-reduced-motion` users get a calm, static-friendly experience

### `apps/playground` — Component Playground

A live sandbox for exploring and testing UI components. Built with:

- **Next.js 16** with Turbopack
- **dnd-kit** — drag and drop for sortable card grids
- **motion** — layout and spring animations
- **@arthurreira/ui** — same component library as the portfolio

Routes: `/`, `/cards`, `/sortable`, `/number-reveal`

---

## Packages

### `packages/ui` — @arthurreira/ui

A published React component library built for RSC-aware Next.js apps. Uses a dual-barrel architecture to keep server and client components properly separated.

**Install:**

```bash
pnpm add @arthurreira/ui
```

**Two entry points:**

```ts
// Server-safe — use anywhere (Server Components, Client Components)
import { cn, Badge, Button, Card, CardContent, Skeleton } from "@arthurreira/ui"

// Client-only — use in Client Components or pass as children to Server Components
import { ThemeProvider, NavBar, ThemeToggle, CardGrid, useMountedAfter, Popover, Select, Dialog } from "@arthurreira/ui/client"
```

**CSS:**

```css
/* Full globals (Tailwind + tokens + base styles) — use in your root layout */
@import "@arthurreira/ui/globals.css";

/* Tokens only (no Tailwind directives) — use when you manage Tailwind yourself */
@import "@arthurreira/ui/tokens.css";
```

Built with: Radix UI, class-variance-authority, Tailwind CSS v4, tw-animate-css, next-themes, Phosphor Icons.

### `packages/content` — @arthurreira/content

Internal MDX content layer powered by [Velite](https://velite.js.org). Defines typed schemas for projects and about pages. Content lives in `packages/content/projects/` and `packages/content/about/` as MDX files.

---

## Development

```bash
# Install dependencies
pnpm install

# Run all apps in parallel
pnpm dev

# Run a specific app
pnpm --filter web dev
pnpm --filter playground dev

# Build everything in dependency order (content builds before web)
pnpm build

# Rebuild the MDX content layer alone
pnpm --filter @arthurreira/content build

# Verify — this repo has no test runner by design
pnpm typecheck
pnpm lint
pnpm format
```

> `@arthurreira/ui` ships raw source (no build step) — consuming apps transpile
> it via `transpilePackages`.

---

## Git Workflow

```text
feature branch → PR to dev → test → merge to main
```

- All changes go through a feature branch
- PRs always target `dev` first
- `dev` is the staging branch — tested before merging to `main`
- `main` is always production-ready

Branch naming: `feat/`, `fix/`, `docs/`, `chore/`

---

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | Radix UI, @arthurreira/ui |
| Animations | Motion (motion/react) |
| Smooth scroll | Lenis |
| Content | Velite + MDX |
| i18n | next-intl |
| Drag & Drop | dnd-kit |
| Package Manager | pnpm (workspace) |
| Deployment | Vercel |
