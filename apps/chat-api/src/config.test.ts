import { describe, expect, it } from "vitest"

import { resolveChatConfig } from "./config"

describe("resolveChatConfig", () => {
  it("falls back to defaults when nothing is configured", () => {
    const config = resolveChatConfig({})

    expect(config).toEqual({
      model: "claude-haiku-4-5",
      fallbackModel: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      maxOutputTokens: 1024,
      maxHistoryMessages: 20,
    })
  })

  it("takes model overrides and trims them", () => {
    const config = resolveChatConfig({
      CHAT_MODEL: "  claude-sonnet-5  ",
      CHAT_FALLBACK_MODEL: " @cf/meta/llama-3.1-8b-instruct ",
    })

    expect(config.model).toBe("claude-sonnet-5")
    expect(config.fallbackModel).toBe("@cf/meta/llama-3.1-8b-instruct")
  })

  it("ignores blank model overrides", () => {
    const config = resolveChatConfig({
      CHAT_MODEL: "   ",
      CHAT_FALLBACK_MODEL: "",
    })

    expect(config.model).toBe("claude-haiku-4-5")
    expect(config.fallbackModel).toBe(
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
    )
  })
})

describe("resolveChatConfig cost ceilings", () => {
  it("lets config lower the output-token cap", () => {
    const config = resolveChatConfig({ CHAT_MAX_OUTPUT_TOKENS: "256" })

    expect(config.maxOutputTokens).toBe(256)
  })

  it("never lets config raise the output-token cap above the ceiling", () => {
    const config = resolveChatConfig({ CHAT_MAX_OUTPUT_TOKENS: "999999" })

    expect(config.maxOutputTokens).toBe(2048)
  })

  it("lets config lower the history window", () => {
    const config = resolveChatConfig({ CHAT_MAX_HISTORY_MESSAGES: "5" })

    expect(config.maxHistoryMessages).toBe(5)
  })

  it("never lets config raise the history window above the ceiling", () => {
    const config = resolveChatConfig({ CHAT_MAX_HISTORY_MESSAGES: "999999" })

    expect(config.maxHistoryMessages).toBe(50)
  })

  it.each([
    ["not a number", "abc"],
    ["zero", "0"],
    ["negative", "-100"],
    ["float", "12.5"],
    ["empty", ""],
    ["whitespace", "   "],
  ])("falls back to the default when the value is %s", (_label, raw) => {
    const config = resolveChatConfig({
      CHAT_MAX_OUTPUT_TOKENS: raw,
      CHAT_MAX_HISTORY_MESSAGES: raw,
    })

    expect(config.maxOutputTokens).toBe(1024)
    expect(config.maxHistoryMessages).toBe(20)
  })
})
