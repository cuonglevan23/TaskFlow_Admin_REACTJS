import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuditLogs } from '../context/audit-logs-context'
import { 
  IconEye,
  IconAlertTriangle,
  IconX,
  IconTrendingUp,
  IconUsers
} from '@tabler/icons-react'

export function SuspiciousActivitiesDashboard() {
  const { dashboardData } = useAuditLogs()

  return (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Critical Alerts</CardTitle>
            <IconAlertTriangle className='h-4 w-4 text-destructive' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-destructive'>
              {dashboardData.criticalAlerts}
            </div>
            <p className='text-xs text-muted-foreground'>
              High risk activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Suspicious Activities</CardTitle>
            <IconEye className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {dashboardData.suspiciousActivities}
            </div>
            <p className='text-xs text-muted-foreground'>
              Flagged for review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Failed Operations</CardTitle>
            <IconX className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {dashboardData.failedOperations}
            </div>
            <p className='text-xs text-muted-foreground'>
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
            <IconUsers className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {dashboardData.activeUsers}
            </div>
            <p className='text-xs text-muted-foreground'>
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <IconTrendingUp className='mr-2 h-5 w-5' />
            Top Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {dashboardData.topActions.length > 0 ? (
              dashboardData.topActions.map((action, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline'>{action.action}</Badge>
                  </div>
                  <span className='text-sm font-medium'>{action.count}</span>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>No action data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Suspicious Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <div key={index} className='flex items-center justify-between p-2 border rounded'>
                  <div>
                    <p className='text-sm font-medium'>{activity.activity}</p>
                    <p className='text-xs text-muted-foreground'>by {activity.user}</p>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {new Date(activity.time).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>No recent activities</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}