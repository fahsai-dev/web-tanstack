import type { SampleAPIListResponse } from '#/types/sampleapis/@types.ts'
import { createFileRoute } from '@tanstack/react-router'

const API_URL = 'https://api.sampleapis.com/coffee/hot'

export const Route = createFileRoute('/api/data')({
  server: {
    handlers: {
      GET: async () => {
        const response = await fetch(API_URL, {
          headers: { accept: 'application/json' },
        })

        if (!response.ok) {
          return Response.json(
            { error: `Failed to fetch coffee list: ${response.statusText}` },
            { status: response.status },
          )
        }

        const data: SampleAPIListResponse = await response.json()
        return Response.json(data)
      },
    },
  },
})
