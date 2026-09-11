import type { SampleAPIListResponse } from '#/types/sampleapis/@types.ts'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { loggedFetch } from '#/lib/loggedFetch.ts'

const API_URL = 'https://api.sampleapis.com/coffee/hot'

export const fetchCoffeeList = createServerFn().handler(
  async (): Promise<SampleAPIListResponse> => {
    const response = await loggedFetch(API_URL, {
      headers: {
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    return response.json()
  },
)

export const coffeeListQueryOptions = () =>
  queryOptions({
    queryKey: ['coffee', 'list'],
    queryFn: () => fetchCoffeeList(),
  })
