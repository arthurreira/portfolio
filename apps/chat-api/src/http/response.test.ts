import { describe, expect, it } from "vitest"

import { json } from "./response"

describe("json", () => {
  it("defaults to 200 and JSON content type", async () => {
    const response = json({ success: true, data: { answer: "hei" } })

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe("application/json")
    expect(await response.json()).toEqual({
      success: true,
      data: { answer: "hei" },
    })
  })

  it("carries an error envelope with its status", async () => {
    const response = json({ success: false, error: "too_many_messages" }, 400)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      success: false,
      error: "too_many_messages",
    })
  })

  it("merges extra headers alongside the content type", () => {
    const response = json({ success: true }, 200, {
      "access-control-allow-origin": "https://arthurreira.dev",
    })

    expect(response.headers.get("content-type")).toBe("application/json")
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://arthurreira.dev"
    )
  })

  it("lets a caller override the content type", () => {
    const response = json({ success: true }, 200, {
      "content-type": "application/problem+json",
    })

    expect(response.headers.get("content-type")).toBe(
      "application/problem+json"
    )
  })
})
