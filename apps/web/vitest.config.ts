import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the `@/*` path in tsconfig.json, which Vite does not read.
      "@": fileURLToPath(new URL(".", import.meta.url)),
      // `next` ships no exports map, so strict ESM resolution cannot extend
      // `next/navigation` to its `.js` file the way the Next bundler does.
      // `routing.ts` reaches it through next-intl's `createNavigation`.
      "next/navigation": "next/navigation.js",
    },
  },
  test: {
    // Node by default: the logic under `i18n/` and `lib/` never touches the
    // DOM. A test that needs one opts in per file with a
    // `// @vitest-environment jsdom` docblock rather than paying for it here.
    environment: "node",
    // next-intl must be processed by Vite rather than left to Node's ESM
    // loader, or the `next/navigation` alias above never applies to it.
    server: { deps: { inline: ["next-intl"] } },
    include: ["{i18n,lib}/**/*.test.ts", "components/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // `hooks/` is listed file by file: the other two hooks have no tests
      // yet, and pulling the whole folder in would drop the totals below.
      include: ["i18n/**/*.ts", "lib/**/*.ts", "hooks/use-stop-on-unmount.ts"],
      // `request.ts` is a next-intl entry point, not logic — the logic it used
      // to hold now lives in `resolve-locale.ts`, which is covered.
      exclude: ["**/*.test.ts", "i18n/request.ts"],
      reporter: ["text", "json-summary", "lcov"],
      // The modules under test are at 100%; the total is held down by the DOM
      // helpers in `lib/`, still untested. Ratchet these up as those land —
      // never down.
      thresholds: {
        lines: 84,
        functions: 94,
        branches: 83,
        statements: 84,
      },
    },
  },
})
