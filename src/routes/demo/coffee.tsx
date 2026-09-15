import type { SampleAPIItemResponse } from '#/types/sampleapis/@types.ts'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { coffeeListQueryOptions, toggleCoffeeFavorite } from '#/server/data.ts'

export const Route = createFileRoute('/demo/coffee')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...coffeeListQueryOptions(),
      staleTime: 'static',
    }),
  component: RouteComponent,
})

function Card({
  i,
  isFavorited,
  onFavoriteChange,
}: {
  i: SampleAPIItemResponse
  isFavorited: boolean
  onFavoriteChange: (id: number, favorited: boolean) => void
}) {
  // Own mutation instance per card, so pending/variables state can't be
  // clobbered by clicking a different card while this one is still in flight.
  const favoriteMutation = useMutation({
    mutationFn: () => toggleCoffeeFavorite({ data: { id: i.id } }),
    onSuccess: (result) => onFavoriteChange(result.id, result.favorited),
  })

  const isToggling = favoriteMutation.isPending
  // Optimistic UI: while in flight, assume it will flip — falls back to the
  // confirmed `isFavorited` prop automatically once the mutation settles.
  const optimisticFavorited = isToggling ? !isFavorited : isFavorited

  return (
    <div
      className="bg-white/10 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
      aria-label={`Movie: ${i.title}`}
      role="group"
    >
      {i.image && (
        <div className="relative">
          <img
            src={i.image}
            alt={i.title}
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            aria-label={optimisticFavorited ? 'Unfavorite' : 'Favorite'}
            aria-pressed={optimisticFavorited}
            disabled={isToggling}
            onClick={() => favoriteMutation.mutate()}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center disabled:opacity-50"
          >
            {optimisticFavorited ? '❤️' : '🤍'}
          </button>
        </div>
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
  const queryClient = useQueryClient()
  const { data: coffeeList, isFetching } = useSuspenseQuery(
    coffeeListQueryOptions(),
  )
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())

  const handleFavoriteChange = (id: number, favorited: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (favorited) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  return (
    <main className="demo-page demo-center">
      <div className="w-full max-w-6xl p-8 rounded-xl demo-panel">
        <h1 className="text-3xl mb-6 font-bold text-center">Popular Coffee</h1>

        {coffeeList.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            aria-label="Movie List"
          >
            {coffeeList.slice(0, 16).map((i: SampleAPIItemResponse) => (
              <Card
                key={i.id}
                i={i}
                isFavorited={favoriteIds.has(i.id)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400" role="status">
            Loading...
          </div>
        )}

        <button
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50"
          disabled={isFetching}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ['coffee', 'list'] })
          }
        >
          {isFetching ? 'Reloading…' : 'Reload'}
        </button>
      </div>
    </main>
  )
}
