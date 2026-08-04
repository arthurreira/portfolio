// Bindings and secrets (e.g. ANTHROPIC_API_KEY) are added in later steps.
export type Env = Record<string, never>

// Shared response envelope, per the repo's ApiResponse<T> convention.
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

const json = <T>(body: ApiResponse<T>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (request.method === "GET" && pathname === "/health") {
      return json({ success: true, data: { status: "ok" } })
    }

    return json({ success: false, error: "not_found" }, 404)
  },
} satisfies ExportedHandler<Env>
