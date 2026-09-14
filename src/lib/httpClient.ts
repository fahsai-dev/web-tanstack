import axios from 'axios'
import { logHandler } from '#/lib/logHandler.ts'
import type { InternalAxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startedAt: number
      consumer: 'server' | 'client'
      path: string
      method: string
    }
  }
}

export const httpClient = axios.create()

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const consumer = typeof window === 'undefined' ? 'server' : 'client'
  const path = axios.getUri(config)
  const method = (config.method ?? 'get').toUpperCase()

  config.metadata = { startedAt: Date.now(), consumer, path, method }

  logHandler.call({
    consumer,
    path,
    method,
    headers: config.headers,
    payload: config.data,
  })

  return config
})

httpClient.interceptors.response.use(
  (response) => {
    const metadata = response.config.metadata
    const durationMs = metadata ? Date.now() - metadata.startedAt : 0

    logHandler.success({
      consumer: metadata?.consumer ?? 'server',
      path: metadata?.path ?? response.config.url ?? '',
      method: metadata?.method ?? response.config.method?.toUpperCase() ?? 'GET',
      status: response.status,
      durationMs,
      data: response.data,
    })

    return response
  },
  (error) => {
    const metadata = axios.isAxiosError(error)
      ? error.config?.metadata
      : undefined
    const durationMs = metadata ? Date.now() - metadata.startedAt : 0

    logHandler.error({
      consumer: metadata?.consumer ?? (typeof window === 'undefined' ? 'server' : 'client'),
      path: metadata?.path ?? '',
      method: metadata?.method ?? 'GET',
      durationMs,
      error: axios.isAxiosError(error) && error.response
        ? `HTTP ${error.response.status}: ${error.response.statusText}`
        : error,
    })

    return Promise.reject(error)
  },
)
