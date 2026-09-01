import { describe, expect, it } from "vitest"

import { getRotationAdvanceLimit } from "./rotation"

describe("getRotationAdvanceLimit", () => {
  it("shows every word once without wrapping for one cycle", () => {
    expect(getRotationAdvanceLimit(4, 1)).toBe(3)
  })

  it("keeps rotation unlimited when no cycle count is provided", () => {
    expect(getRotationAdvanceLimit(4)).toBeUndefined()
  })

  it("does not advance an empty or single-word sequence", () => {
    expect(getRotationAdvanceLimit(0, 1)).toBe(0)
    expect(getRotationAdvanceLimit(1, 1)).toBe(0)
  })
})
