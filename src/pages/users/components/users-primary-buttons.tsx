import { IconRefresh, IconDownload, IconUsers } from '@tabler/icons-react'
import { useUsers } from '../context/users-context'
import { Button } from '@/components/custom/button'

export function UsersPrimaryButtons() {
  const { refreshUsers, loading, pagination } = useUsers()

  const handleExportUsers = () => {
    // TODO: Implement export functionality if needed
    // Export users functionality
  }

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={refreshUsers}
        disabled={loading}
      >
        <span>Refresh</span>
        <IconRefresh size={18} className={loading ? 'animate-spin' : ''} />
      </Button>

      <Button
        variant='outline'
        className='space-x-1'
        onClick={handleExportUsers}
        disabled={pagination.totalElements === 0}
      >
        <span>Export Data</span>
        <IconDownload size={18} />
      </Button>

      <div className='flex items-center space-x-2 px-3 py-2 bg-muted rounded-md'>
        <IconUsers size={18} />
        <span className='text-sm font-medium'>
          {pagination.totalElements} users
        </span>
      </div>
    </div>
  )
}
