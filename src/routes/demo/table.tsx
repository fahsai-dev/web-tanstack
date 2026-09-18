import { createFileRoute } from '@tanstack/react-router'
import {
  tableFeatures,
  useTable,
  rowPaginationFeature,
  createPaginatedRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

// 2. Give your data a stable reference (module scope, useState, useQuery, etc.)
const data: Array<Person> = [
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
]

// 3. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

// 4. Define your columns
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey shorthand
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn alternative with a custom id
    id: 'lastName',
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{info.getValue<string>()}</i>,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
]

// 5. Search params validation: parse + coerce the raw (untyped) URL search
// object into a typed, safe shape. Anything invalid falls back to a default
// instead of throwing, so bad/missing query strings never crash the route.
const ALLOWED_PAGE_SIZES = [10, 20, 30, 40, 50]

type TableSearch = {
  page: number
  pageSize: number
}

function validateTableSearch(search: Record<string, unknown>): TableSearch {
  const rawPage = Number(search.page)
  const rawPageSize = Number(search.pageSize)

  return {
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    pageSize: ALLOWED_PAGE_SIZES.includes(rawPageSize) ? rawPageSize : 10,
  }
}

export const Route = createFileRoute('/demo/table')({
  validateSearch: validateTableSearch,
  component: RouteComponent,
})

function RouteComponent() {
  // Typed + validated search params, e.g. /demo/table?page=2&pageSize=20
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const table = useTable({
    key: 'person-table', // needed for devtools, omit if you don't want to use the devtools
    features,
    columns,
    data,
    // Let the URL search params be the source of truth for pagination state.
    state: {
      pagination: { pageIndex: search.page - 1, pageSize: search.pageSize },
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: search.page - 1, pageSize: search.pageSize }
      const next = typeof updater === 'function' ? updater(current) : updater
      navigate({
        search: () => ({ page: next.pageIndex + 1, pageSize: next.pageSize }),
        replace: true,
      })
    },
  })

  return (
    <div className="p-4">
      <table className="w-full border-collapse overflow-hidden rounded-lg border border-gray-200 text-left text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b border-gray-200 px-4 py-3 font-semibold">
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="border-b border-gray-200 px-4 py-3">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'First'}
        </button>
        <button
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => table.lastPage()}
          disabled={!table.getCanLastPage()}
        >
          {'Last'}
        </button>
        <table.Subscribe selector={(state) => state.pagination.pageSize}>
          {(pageSize) => (
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          )}
        </table.Subscribe>
      </div>
    </div>
  )
}
