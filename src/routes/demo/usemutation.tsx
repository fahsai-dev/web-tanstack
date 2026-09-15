import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getClient } from '#/db'

type Todo = { id: number; title: string }

const getTodos = createServerFn({ method: 'GET' }).handler(async () => {
  const client = await getClient()
  if (!client) return undefined
  return (await client.query(`SELECT * FROM todos ORDER BY id`)) as Array<Todo>
})

const insertTodo = createServerFn({ method: 'POST' })
  .inputValidator((d: { title: string }) => d)
  .handler(async ({ data }) => {
    const client = await getClient()
    if (!client) return undefined
    await client.query(`INSERT INTO todos (title) VALUES ($1)`, [data.title])
  })

const todosQueryOptions = () =>
  queryOptions({
    queryKey: ['todos'],
    queryFn: () => getTodos(),
  })

export const Route = createFileRoute('/demo/usemutation')({
  loader: ({ context }) => context.queryClient.ensureQueryData(todosQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data: todos } = useSuspenseQuery(todosQueryOptions())

  const addTodo = useMutation({
    mutationFn: (title: string) => insertTodo({ data: { title } }),
    onSuccess: () => {
      // ทำให้ useQuery ที่ผูกกับ key นี้ refetch ใหม่หลัง mutate สำเร็จ
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const title = new FormData(form).get('title') as string
    if (!title.trim()) return
    addTodo.mutate(title, { onSuccess: () => form.reset() })
  }

  if (!todos) {
    return (
      <main className="demo-page demo-center">
        <section className="demo-panel w-full max-w-2xl text-center">
          <p>ไม่พบ DATABASE_URL — ดูตัวอย่างการตั้งค่าได้ที่หน้า Neon Demo</p>
        </section>
      </main>
    )
  }

  return (
    <main className="demo-page demo-center">
      <section className="demo-panel w-full max-w-2xl">
        <h1 className="demo-title mb-6">useMutation Demo</h1>

        <ul className="space-y-3 mb-6">
          {todos.map((todo) => (
            <li key={todo.id} className="demo-list-item">
              <div className="flex items-center justify-between">
                <span className="font-medium">{todo.title}</span>
                <span className="demo-muted text-xs">#{todo.id}</span>
              </div>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="text"
            name="title"
            className="demo-input min-w-0 flex-1"
            disabled={addTodo.isPending}
          />
          <button
            type="submit"
            className="demo-button whitespace-nowrap disabled:opacity-50"
            disabled={addTodo.isPending}
          >
            {addTodo.isPending ? 'Adding…' : 'Add Todo'}
          </button>
        </form>

        {addTodo.isError && (
          <p className="text-red-400 text-sm mt-2">
            Failed to add todo: {String(addTodo.error)}
          </p>
        )}
      </section>
    </main>
  )
}
