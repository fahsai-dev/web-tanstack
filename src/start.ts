import { createStart } from '@tanstack/react-start'
import { requestLoggerMiddleware } from '#/server/middleware/logger.ts'

export const startInstance = createStart(() => ({
  requestMiddleware: [requestLoggerMiddleware],
}))
