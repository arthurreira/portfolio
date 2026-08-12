import type { Mock } from "vitest"

/**
 * Reads one argument of a recorded mock call.
 *
 * `mock.calls[n]` is `T | undefined` under `noUncheckedIndexedAccess`, and a
 * bare cast would turn "never called" into a confusing property access on
 * undefined. This fails with the reason instead.
 */
export const callArg = <T>(mock: Mock, position = 0, index = 0): T => {
  const call = mock.mock.calls[index]

  if (!call) {
    throw new Error(
      `expected call #${index}, but the mock was called ${mock.mock.calls.length} time(s)`
    )
  }

  return call[position] as T
}
