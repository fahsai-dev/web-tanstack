import { logHandler } from '#/lib/logHandler.ts'

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function loggedFetch(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  const consumer = typeof window === 'undefined' ? 'server' : 'client'
  const path = input.toString()
  const method = init?.method ?? 'GET'

  logHandler.call({
    consumer,
    path,
    method,
    headers: init?.headers,
    payload: init?.body,
  })

  const startedAt = Date.now()

  try {
    const response = await fetch(input, init)
    const durationMs = Date.now() - startedAt
    const data = await parseBody(response.clone())

    if (response.ok) {
      logHandler.success({
        consumer,
        path,
        method,
        status: response.status,
        durationMs,
        data,
      })
    } else {
      logHandler.error({
        consumer,
        path,
        method,
        durationMs,
        error: `HTTP ${response.status}: ${response.statusText}`,
      })
    }

    return response
  } catch (err) {
    const durationMs = Date.now() - startedAt
    logHandler.error({ consumer, path, method, durationMs, error: err })
    throw err
  }
}
