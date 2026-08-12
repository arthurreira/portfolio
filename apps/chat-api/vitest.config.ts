import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
      reporter: ["text", "json-summary", "lcov"],
      // Baseline measured when the harness landed. Ratcheted up as each phase
      // of the test plan lands — never lower these to make a build pass.
      thresholds: {
        lines: 4,
        functions: 3,
        branches: 4,
        statements: 4,
      },
    },
  },
})
