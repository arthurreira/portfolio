import { describe, expect, it } from "vitest"

import { MAX_BODY_BYTES, validateChatRequest } from "./validation"

const message = (text: string, role = "user") => ({
  role,
  parts: [{ type: "text", text }],
})

describe("validateChatRequest shape", () => {
  it("accepts a minimal valid request", () => {
    const result = validateChatRequest({ messages: [message("hei")] })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.messages).toHaveLength(1)
    expect(result.data.model).toBe("claude")
  })

  it("carries locale and turnstile token through", () => {
    const result = validateChatRequest({
      messages: [message("hei")],
      locale: "fi",
      turnstileToken: "token-abc",
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.locale).toBe("fi")
    expect(result.data.turnstileToken).toBe("token-abc")
  })

  it.each([
    ["null", null],
    ["a string", "messages"],
    ["an empty object", {}],
    ["an empty message list", { messages: [] }],
    ["messages that are not an array", { messages: "hei" }],
    ["an unknown role", { messages: [message("hei", "root")] }],
    ["a message with no parts array", { messages: [{ role: "user" }] }],
  ])("rejects %s", (_label, payload) => {
    const result = validateChatRequest(payload)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBe("invalid_messages")
  })
})

describe("validateChatRequest cost limits", () => {
  it("rejects more than 50 messages", () => {
    const result = validateChatRequest({
      messages: Array.from({ length: 51 }, () => message("hei")),
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBe("too_many_messages")
  })

  it("accepts exactly 50 messages", () => {
    const result = validateChatRequest({
      messages: Array.from({ length: 50 }, () => message("hei")),
    })

    expect(result.ok).toBe(true)
  })

  it("rejects a single message over 4000 characters", () => {
    const result = validateChatRequest({
      messages: [message("a".repeat(4_001))],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBe("message_too_long")
  })

  it("accepts a message at exactly 4000 characters", () => {
    const result = validateChatRequest({
      messages: [message("a".repeat(4_000))],
    })

    expect(result.ok).toBe(true)
  })

  // The per-message cap alone does not bound the bill: messages that are each
  // legal still add up.
  it("rejects a conversation over 24000 characters in total", () => {
    const result = validateChatRequest({
      messages: Array.from({ length: 10 }, () => message("a".repeat(3_000))),
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBe("conversation_too_long")
  })

  it("accepts a conversation at exactly 24000 characters", () => {
    const result = validateChatRequest({
      messages: Array.from({ length: 8 }, () => message("a".repeat(3_000))),
    })

    expect(result.ok).toBe(true)
  })

  it("caps the body size before parsing", () => {
    expect(MAX_BODY_BYTES).toBe(131_072)
  })
})

describe("validateChatRequest empty-part filtering", () => {
  it("drops messages that contribute no text", () => {
    const result = validateChatRequest({
      messages: [
        { role: "user", parts: [] },
        message("hei"),
        { role: "assistant", parts: [{ type: "step-start" }] },
      ],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.messages).toHaveLength(1)
  })

  it("rejects a request where every message is empty", () => {
    const result = validateChatRequest({
      messages: [
        { role: "user", parts: [] },
        { role: "user", parts: [{ type: "text", text: "" }] },
      ],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBe("invalid_messages")
  })
})

describe("validateChatRequest model choice", () => {
  it("honours the free model when asked for exactly", () => {
    const result = validateChatRequest({
      messages: [message("hei")],
      model: "workers-ai",
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.model).toBe("workers-ai")
  })

  // A forged value must not select a model, and must not produce an error that
  // maps out the allowlist either.
  it.each([
    ["an unknown model id", "claude-opus-4-1"],
    ["a near miss with trailing space", "workers-ai "],
    ["a different case", "Workers-AI"],
    ["a number", 1],
    ["null", null],
    ["an object", { id: "workers-ai" }],
    ["undefined", undefined],
  ])("silently falls back to the default for %s", (_label, model) => {
    const result = validateChatRequest({ messages: [message("hei")], model })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.model).toBe("claude")
  })
})
