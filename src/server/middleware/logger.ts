import { createMiddleware } from '@tanstack/react-start'
import { log } from '#/lib/logger.ts'

export const requestLoggerMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ request, pathname, next, handlerType }) => {
  const startedAt = Date.now()
  const result = await next()
  const durationMs = Date.now() - startedAt

  log.info('request', {
    method: request.method,
    pathname,
    handlerType,
    status: result.response.status,
    durationMs,
  })

  return result
})
