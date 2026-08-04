# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`arthurreira-dev` is a **pnpm + Turborepo monorepo** for a personal portfolio. It contains two Next.js 16 apps and a published React component library, wired together through workspace packages.

- `apps/web` — Portfolio site → [arthurreira.dev](https://arthurreira.dev)
- `apps/playground` — Component sandbox → [playground.arthurreira.dev](https://playground.arthurreira.dev)
- `apps/chat-api` — Cloudflare Worker backing the portfolio AI chat
- `packages/ui` — `@arthurreira/ui`, the shared component library
- `packages/content` — `@arthurreira/content`, the Velite/MDX content layer
- `packages/eslint-config`, `packages/typescript-config` — shared configs

Requires Node >=20 and pnpm 9.15.9 (`packageManager` is pinned).

## Commands

All commands run from the repo root via Turbo (which fans out to workspaces respecting the `^build`/`^lint` dependency graph):

```bash
pnpm install          # install everything
pnpm dev              # run all apps in parallel (persistent, uncached)
pnpm build            # build all packages/apps in dependency order
pnpm lint             # eslint across the workspace
pnpm typecheck        # tsc --noEmit across the workspace
pnpm format           # prettier --write
```

Target a single workspace with `--filter`:

```bash
pnpm --filter web dev
pnpm --filter playground dev
pnpm --filter @arthurreira/ui typecheck
pnpm --filter @arthurreira/content build   # runs velite build
```

**There is no test runner configured in this repo** — no Jest/Vitest/Playwright setup and no test files exist. Do not assume `pnpm test` works; verify changes with `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

## Architecture

### `@arthurreira/ui` — dual-barrel RSC separation (most important pattern)

The library exposes **two entry points** to keep the React Server Component boundary clean:

- `src/index.ts` — **server-safe** exports, no `"use client"`. Importable anywhere (`import { cn, Badge, Button, Card } from "@arthurreira/ui"`).
- `src/client.ts` — starts with `"use client"`; client-only components/hooks/providers (`import { ThemeProvider, NavBar, ThemeToggle, Dialog } from "@arthurreira/ui/client"`).

When adding a component, **put its re-export in the correct barrel**. Anything using hooks, context, event handlers, or browser APIs belongs in `client.ts`; purely presentational/server-safe components belong in `index.ts`. Getting this wrong surfaces as "you're importing a component that needs `use client`" errors in consuming apps.

The package ships **source `.ts`/`.tsx` directly** (no build step — the `exports` map points at `src/`). Consuming apps must therefore transpile it: `apps/web/next.config.mjs` sets `transpilePackages: ["@arthurreira/ui"]`. Styling ships as CSS entry points: `@arthurreira/ui/globals.css` (full Tailwind v4 + tokens) and `@arthurreira/ui/tokens.css` (tokens only). Fine-grained subpath exports exist for `./components/*`, `./lib/*`, `./hooks/*`.

Built on Tailwind CSS v4, Radix UI / `@base-ui/react`, `class-variance-authority`, `next-themes`, and Phosphor Icons. shadcn components are pulled via the private registry `https://ui.arthurreira.dev/r/{name}.json` (see `apps/web/components.json`) — the shadcn `ui` alias resolves to `@arthurreira/ui/components`, so generated components land in the shared library, not the app.

### `@arthurreira/content` — Velite content pipeline

MDX content lives in `packages/content/projects/**/*.mdx` and `packages/content/about/*.mdx`. `velite.config.ts` defines typed Zod schemas for two collections (`projects`, `about`) and, on build, emits typed data to `packages/content/.velite/` (git-ignored) plus processed assets into `apps/web/public/static`.

Key schema behaviors to know:
- `slug` and `locale` are **derived from the file path**, not frontmatter. A project's locale comes from `projects/<slug>/<locale>/...` path segments; filter by `locale` when querying.
- Project/role enums live in `packages/content/src/types/project.ts` (`PROJECT_STATUSES`, `PROJECT_ROLES`) and are imported by the config — edit enums there.
- The consumer imports the generated barrel: `import { projects, about } from "@arthurreira/content"`. **Content must be built before the web app** (Turbo's `^build` handles this); if content types look stale, re-run the content build.

Consumed in `apps/web/app/[locale]/projects/*`, `components/organisms/site-project-detail.tsx`, and `site-about.tsx`.

### `apps/web` — i18n-first Next.js App Router

Internationalized with **next-intl**. Locales are `['en', 'fi', 'pt-br']` with **`defaultLocale: 'fi'`** and `localePrefix: 'always'` (every URL is locale-prefixed). Config: `i18n/routing.ts` (locales + typed navigation helpers), `i18n/request.ts` (loads `messages/<locale>.json`), and `proxy.ts` (the next-intl middleware; note it is `proxy.ts`, not `middleware.ts`).

- Import navigation helpers (`Link`, `useRouter`, `redirect`) from `@/i18n/routing`, **not** from `next/link` / `next/navigation`, so locale prefixing is preserved.
- UI strings live in `apps/web/messages/*.json` — keep all three locale files in sync when adding keys.
- All routes are under `app/[locale]/` (`/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`).
- Components follow **atomic design**: `components/atoms`, `components/molecules`, `components/organisms`.

### `apps/playground`

Standalone Next.js sandbox for the same `@arthurreira/ui` components, adding `@dnd-kit` (drag-and-drop sortable grids) and `motion`. Routes: `/`, `/cards`, `/sortable`.

### `apps/chat-api` — AI chat Worker

A Cloudflare Worker (Wrangler + TypeScript) that answers visitor questions about Arthur. **Stateless by design**: nothing is persisted anywhere — no database, no KV/D1/Durable Objects, no vector store. Conversations live in React state and disappear on refresh.

- **Context, not RAG.** The portfolio is small enough to fit in the system prompt, assembled per locale in `src/lib/portfolio-context.ts` from `@arthurreira/content`. Note the Velite `content` field is *compiled MDX* (a JS function) and unusable as model context — the about text comes from `raw: s.raw()`, and projects are rendered from their structured metadata.
- **Wire format: the AI SDK UI Message Stream.** `POST /chat` returns `createUIMessageStreamResponse(toUIMessageStream(...))` from `ai`, so the browser consumes it with `useChat` + `DefaultChatTransport` and no custom parsing. (`result.toUIMessageStreamResponse()` is deprecated — use the standalone helpers.) `convertToModelMessages()` is async in `ai@7`; await it.
- **Config vs. secret.** `ANTHROPIC_API_KEY` is the only secret (`wrangler secret put`, or `.dev.vars` locally — both gitignored). Model, output-token cap, and history window are plain env vars resolved in `src/lib/config.ts`; cost-critical values are **clamped to hardcoded ceilings**, so config can lower them but never raise them.
- `@ai-sdk/anthropic` needs the `nodejs_compat` compatibility flag in `wrangler.jsonc`.
- **`wrangler dev` does not hot-reload `.dev.vars`** — restart it after changing a key, or you will keep debugging a stale value.

**Building the chat UI without a model.** `@shadcn/helpers/ai-sdk` scripts a conversation in code and streams it through the real `useChat` lifecycle — no model, API route, network request, or API key. Because the Worker speaks the standard AI SDK protocol, the helper is a drop-in stand-in for it:

```ts
import { createChat } from "@shadcn/helpers/ai-sdk"

const chat = createChat()
  .user("What projects use TypeScript?")
  .assistant("AF Analytics and dns-tool.")

// useChat({ messages: chat.get(0), transport: chat.transport() })
```

Use it to develop message bubbles and streaming states offline, deterministically, and **without spending API credits**. It is a development and testing tool only — production always goes through the Worker.

## Conventions

- **Prettier** (`.prettierrc`): no semicolons, double quotes, 2-space tabs, `printWidth: 80`, `trailingComma: es5`. Tailwind class sorting is enabled and aware of `cn` / `cva`.
- **Animations** use `motion` (`motion/react`) — a peer dependency of `@arthurreira/ui`.
- **Git workflow**: feature branch → PR into `dev` (staging, tested) → merge to `main` (production). Branch prefixes: `feat/`, `fix/`, `docs/`, `chore/`. Never PR straight to `main`.
- Snyk scan artifacts (`snyk-results.json` / `snyk-code-results.json`) are **gitignored** — run scans locally, never commit the results (the repo is public). The root `package.json` `pnpm.overrides` block pins transitive deps to remediated versions — preserve it when touching dependencies.
