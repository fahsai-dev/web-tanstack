import type { SampleAPIListResponse } from '#/types/sampleapis/@types.ts'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { httpClient } from '#/lib/httpClient.ts'

const API_URL = 'https://api.sampleapis.com/coffee/hot'

export const fetchCoffeeList = createServerFn().handler(
  async (): Promise<SampleAPIListResponse> => {
    const response = await httpClient.get<SampleAPIListResponse>(API_URL, {
      headers: {
        accept: 'application/json',
      },
    })

    return response.data
  },
)

export const coffeeListQueryOptions = () =>
  queryOptions({
    queryKey: ['coffee', 'list'],
    queryFn: () => fetchCoffeeList(),
  })

// In-memory store for the useMutation demo — resets on server restart.
const favoritedCoffeeIds = new Set<number>()

export const toggleCoffeeFavorite = createServerFn({ method: 'POST' })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }): Promise<{ id: number; favorited: boolean }> => {
    // Artificial delay so the useMutation loading state is visible in the demo.
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (favoritedCoffeeIds.has(data.id)) {
      favoritedCoffeeIds.delete(data.id)
    } else {
      favoritedCoffeeIds.add(data.id)
    }
    return { id: data.id, favorited: favoritedCoffeeIds.has(data.id) }
  })
