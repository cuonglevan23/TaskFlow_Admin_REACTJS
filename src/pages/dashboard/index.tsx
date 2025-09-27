import { Layout } from '@/components/custom/layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/custom/button'
import { IconRefresh } from '@tabler/icons-react'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import { Charts } from './components/analytics'
import { DashboardProvider, useDashboard } from './context/dashboard-context'

function DashboardContent() {
  const { stats, loading, error, refreshDashboard } = useDashboard()

  if (error) {
    return (
      <Layout.Body>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">⚠️ {error}</p>
            <Button onClick={refreshDashboard} variant="outline">
              <IconRefresh className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </Layout.Body>
    )
  }

  return (
    <Layout.Body>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <Button onClick={refreshDashboard} variant="outline" size="sm" disabled={loading}>
          <IconRefresh className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>
      <Tabs
        orientation='vertical'
        defaultValue='overview'
        className='space-y-4'
      >
        <div className='w-full overflow-x-auto pb-2'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Tổng doanh thu
                </CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {loading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `$${stats?.totalRevenue.toLocaleString() || '0'}`
                  )}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {loading ? (
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                  ) : (
                    `${(stats?.revenueGrowth || 0) > 0 ? '+' : ''}${(stats?.revenueGrowth || 0).toFixed(1)}% từ tháng trước`
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Tổng người dùng
                </CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                  <circle cx='9' cy='7' r='4' />
                  <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `${stats?.totalUsers.toLocaleString() || '0'}`
                  )}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {loading ? (
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                  ) : (
                    `${(stats?.userGrowth || 0) > 0 ? '+' : ''}${(stats?.userGrowth || 0).toFixed(1)}% từ tháng trước`
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Tổng số đơn hàng</CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <rect width='20' height='14' x='2' y='5' rx='2' />
                  <path d='M2 10h20' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {loading ? (
                    <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `${stats?.totalSales.toLocaleString() || '0'}`
                  )}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {loading ? (
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                  ) : (
                    `${(stats?.salesGrowth || 0) > 0 ? '+' : ''}${(stats?.salesGrowth || 0).toFixed(1)}% từ tháng trước`
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Người dùng đang hoạt động
                </CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `${stats?.activeUsers.toLocaleString() || '0'}`
                  )}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {loading ? (
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                  ) : (
                    `${(stats?.activeGrowth || 0) > 0 ? '+' : ''}${(stats?.activeGrowth || 0).toFixed(1)}% từ giờ trước`
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>Doanh thu hàng tháng trong 12 tháng qua</CardDescription>
              </CardHeader>
              <CardContent className='pl-2'>
                <Overview />
              </CardContent>
            </Card>
            <Card className='col-span-1 lg:col-span-3'>
              <CardHeader>
                <CardTitle>Người dùng gần đây</CardTitle>
                <CardDescription>
                  Người dùng mới nhất đã tham gia hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='analytics' className='space-y-4'>
          <Charts />
        </TabsContent>
      </Tabs>
    </Layout.Body>
  )
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <Layout fixed>
        <DashboardContent />
      </Layout>
    </DashboardProvider>
  )
}
