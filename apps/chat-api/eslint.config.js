import { config } from "@arthurreira/eslint-config/base"

/** @type {import("eslint").Linter.Config} */
export default [
  // Wrangler writes bundled build artifacts here; they are not source.
  { ignores: [".wrangler/**"] },
  ...config,
]
