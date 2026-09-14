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
