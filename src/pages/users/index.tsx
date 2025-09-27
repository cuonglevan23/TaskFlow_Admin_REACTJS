import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider, { useUsers } from './context/users-context'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'

function UsersContent() {
  const { users, loading, error, pagination } = useUsers()

  if (error) {
    return (
      <Layout.Body className='flex flex-col'>
        <div className='flex items-center justify-center h-32'>
          <div className='text-center'>
            <p className='text-red-500 mb-2'>⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className='text-blue-500 hover:underline'
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout.Body>
    )
  }

  return (
    <Layout.Body className='flex flex-col'>
      <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>User Management</h2>
          <p className='text-muted-foreground'>
            Manage user list and permissions in the system.
          </p>
        </div>
        <UsersPrimaryButtons />
      </div>

      {/* Users count and status */}
      <div className='mb-4 flex items-center space-x-4 text-sm text-muted-foreground'>
        <span>Total: {pagination.totalElements} users</span>
        <span>•</span>
        <span>Page {pagination.page + 1}/{pagination.totalPages}</span>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <UsersTable
          data={users}
          columns={columns}
          loading={loading}
          pagination={pagination}
        />
      </div>
      <UsersDialogs />
    </Layout.Body>
  )
}

export default function Users() {
  return (
    <UsersProvider>
      <Layout fixed>
        <Layout.Header>
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>
        <UsersContent />
      </Layout>
    </UsersProvider>
  )
}
