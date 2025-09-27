import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { Button } from '@/components/custom/button'
import { useUsers } from '../context/users-context'
import { USER_STATUS_OPTIONS, USER_ROLES } from '@/api/userApi'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { filters, setFilters } = useUsers()
  const isFiltered = filters.search || filters.status

  const handleSearchChange = (value: string) => {
    setFilters({ search: value })
  }

  const handleClearFilters = () => {
    setFilters({ search: '', status: undefined })
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Tìm kiếm theo tên hoặc email...'
          value={filters.search || ''}
          onChange={(event) => handleSearchChange(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Trạng thái'
              options={USER_STATUS_OPTIONS.map((status) => ({
                label: status.label,
                value: status.value,
              }))}
            />
          )}
          {table.getColumn('roleNames') && (
            <DataTableFacetedFilter
              column={table.getColumn('roleNames')}
              title='Quyền'
              options={USER_ROLES.map((role) => ({
                label: role.label,
                value: role.value,
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={handleClearFilters}
            className='h-8 px-2 lg:px-3'
          >
            Xóa bộ lọc
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
