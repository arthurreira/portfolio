/** Shared response envelope, per the repo's ApiResponse<T> convention. */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export const json = <T>(
  body: ApiResponse<T>,
  status = 200,
  headers: Record<string, string> = {}
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  })
