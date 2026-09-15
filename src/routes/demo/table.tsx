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

export const Route = createFileRoute('/demo/table')({
  component: RouteComponent,
})

function RouteComponent() {
  const table = useTable({
    key: 'person-table', // needed for devtools, omit if you don't want to use the devtools
    features,
    columns,
    data,
    // initialState: {
    //   // pageSize < data.length so pagination actually kicks in for this demo
    //   pagination: { pageIndex: 0, pageSize: 2 },
    // },
  })

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'Fist'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanLastPage()}
        >
          {'Last'}
        </button>
        <table.Subscribe selector={(state) => state.pagination.pageSize}>
          {(pageSize) => (
            <select
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
