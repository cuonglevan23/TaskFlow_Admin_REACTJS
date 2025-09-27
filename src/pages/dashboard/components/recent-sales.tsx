import { useDashboard } from '../context/dashboard-context'

export function RecentSales() {
  const { recentSales, salesLoading } = useDashboard()

  if (salesLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {recentSales.map((user) => (
        <div key={user.id} className='flex items-center'>
          <div className='space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
