import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["plugins/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["plugins/**/*.ts"],
      exclude: ["**/*.test.ts"],
      reporter: ["text", "json-summary", "lcov"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
