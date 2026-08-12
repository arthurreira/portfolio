import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/test-support/**"],
      reporter: ["text", "json-summary", "lcov"],
      // Ratcheted up as each phase of the test plan lands — never lower these
      // to make a build pass.
      thresholds: {
        lines: 98,
        functions: 93,
        branches: 89,
        statements: 98,
      },
    },
  },
})
