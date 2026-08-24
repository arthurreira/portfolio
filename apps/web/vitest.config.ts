import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      // `next` ships no exports map, so strict ESM resolution cannot extend
      // `next/navigation` to its `.js` file the way the Next bundler does.
      // `routing.ts` reaches it through next-intl's `createNavigation`.
      "next/navigation": "next/navigation.js",
    },
  },
  test: {
    // No jsdom: this config covers the pure logic under `i18n/` and `lib/`,
    // none of which touches the DOM. A component test would need its own
    // environment and is not what this is for.
    environment: "node",
    // next-intl must be processed by Vite rather than left to Node's ESM
    // loader, or the `next/navigation` alias above never applies to it.
    server: { deps: { inline: ["next-intl"] } },
    include: ["{i18n,lib}/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["i18n/**/*.ts", "lib/**/*.ts"],
      // `request.ts` is a next-intl entry point, not logic — the logic it used
      // to hold now lives in `resolve-locale.ts`, which is covered.
      exclude: ["**/*.test.ts", "i18n/request.ts"],
      reporter: ["text", "json-summary", "lcov"],
      // The two modules under test are at 100%; the total is held down by
      // the DOM helpers in `lib/`, which need an environment this config
      // does not provide. Ratchet these up as those land — never down.
      thresholds: {
        lines: 82,
        functions: 92,
        branches: 83,
        statements: 82,
      },
    },
  },
})
