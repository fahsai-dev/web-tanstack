import type { SampleAPIListResponse } from '#/types/sampleapis/@types.ts'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { httpClient } from '#/lib/httpClient.ts'

const API_URL = 'https://api.sampleapis.com/coffee/hot'

export const Route = createFileRoute('/api/data')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const response = await httpClient.get<SampleAPIListResponse>(
            API_URL,
            { headers: { accept: 'application/json' } },
          )
          return Response.json(response.data)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            return Response.json(
              {
                error: `Failed to fetch coffee list: ${err.response?.statusText ?? err.message}`,
              },
              { status: err.response?.status ?? 500 },
            )
          }
          throw err
        }
      },
    },
  },
})
