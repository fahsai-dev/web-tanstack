import { log } from '#/lib/logger.ts'

export type LogConsumer = 'server' | 'client'

interface CallLogInput {
  consumer: LogConsumer
  path: string
  method: string
  headers?: HeadersInit
  payload?: unknown
}

interface SuccessLogInput {
  consumer: LogConsumer
  path: string
  method: string
  status: number
  durationMs: number
  data: unknown
}

interface ErrorLogInput {
  consumer: LogConsumer
  path: string
  method: string
  durationMs: number
  error: unknown
}

function call({ consumer, path, method, headers, payload }: CallLogInput) {
  log.info(`[${consumer}][call] ${method} ${path}`, {
    path,
    body: { request: { method, headers, payload } },
  })
}

function success({
  consumer,
  path,
  method,
  status,
  durationMs,
  data,
}: SuccessLogInput) {
  log.info(`[${consumer}][success] ${method} ${path}`, {
    path,
    body: { response: { status, durationMs, data } },
  })
}

function error({
  consumer,
  path,
  method,
  durationMs,
  error: err,
}: ErrorLogInput) {
  log.error(`[${consumer}][error] ${method} ${path}`, {
    path,
    body: {
      durationMs,
      error: err instanceof Error ? err.message : err,
    },
  })
}

export const logHandler = { call, success, error }
