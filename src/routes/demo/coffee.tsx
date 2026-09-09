import type {
  SampleAPIItemResponse,
  SampleAPIListResponse,
} from '#/types/sampleapis/@types.ts'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const API_URL = 'https://api.sampleapis.com/coffee/hot'

const fetchCoffeeList = createServerFn().handler(
  async (): Promise<SampleAPIListResponse> => {
    const response = await fetch(API_URL, {
      headers: {
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`)
    }

    return response.json()
  },
)

export const Route = createFileRoute('/demo/coffee')({
  loader: async (): Promise<{
    coffeeList: SampleAPIListResponse
    error: string | null
  }> => {
    try {
      const data = await fetchCoffeeList()
      return { coffeeList: data, error: null }
    } catch (error) {
      console.error('Error fetching:', error)
      return { coffeeList: [], error: 'Failed to load' }
    }
  },
  component: RouteComponent,
})

function Card({ i }: { i: SampleAPIItemResponse }) {
  return (
    <div
      className="bg-white/10 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
      aria-label={`Movie: ${i.title}`}
      role="group"
    >
      {i.image && (
        <img src={i.image} alt={i.title} className="w-full h-64 object-cover" />
      )}
      <div className="p-4">
        <>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{i.title}</h3>
          <p className="text-sm  mb-3 line-clamp-3 h-10">{i.description}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {i.ingredients.map((ingredients) => (
              <span key={ingredients} className="">
                {ingredients}
              </span>
            ))}
          </div>
        </>
      </div>
    </div>
  )
}

function RouteComponent() {
  const { coffeeList, error } = Route.useLoaderData()

  return (
    <main className="demo-page demo-center">
      <div className="w-full max-w-6xl p-8 rounded-xl demo-panel">
        <h1 className="text-3xl mb-6 font-bold text-center">Popular Coffee</h1>

        {error && (
          <div
            className="text-red-400 text-center mb-4 p-4 bg-red-900/20 rounded-lg"
            role="alert"
          >
            {error}
          </div>
        )}

        {coffeeList.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            aria-label="Movie List"
          >
            {coffeeList.slice(0, 16).map((i: SampleAPIItemResponse) => (
              <Card key={i.id} i={i} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center text-gray-400" role="status">
              Loading...
            </div>
          )
        )}
      </div>
    </main>
  )
}
