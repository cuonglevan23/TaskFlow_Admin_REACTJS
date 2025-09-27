import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuditLogs } from '../context/audit-logs-context'
import { 
  IconActivity,
  IconEye,
  IconChartBar,
  IconTrendingUp
} from '@tabler/icons-react'

export function AuditLogsStatistics() {
  const { dashboardData } = useAuditLogs()

  return (
    <div className='space-y-6'>
      {/* Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Logs</CardTitle>
            <IconActivity className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardData.totalLogs.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              All audit entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Suspicious</CardTitle>
            <IconEye className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {dashboardData.suspiciousActivities}
            </div>
            <p className='text-xs text-muted-foreground'>
              Flagged activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Failed Operations</CardTitle>
            <IconChartBar className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {dashboardData.failedOperations}
            </div>
            <p className='text-xs text-muted-foreground'>
              Error rate tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
            <IconTrendingUp className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {dashboardData.activeUsers}
            </div>
            <p className='text-xs text-muted-foreground'>
              Current session count
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Action Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {dashboardData.topActions.length > 0 ? (
              dashboardData.topActions.map((action, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline'>{action.action}</Badge>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-medium'>{action.count}</span>
                    <div className='w-20 bg-muted rounded-full h-2'>
                      <div 
                        className='bg-blue-600 h-2 rounded-full' 
                        style={{ 
                          width: `${Math.min(100, (action.count / Math.max(...dashboardData.topActions.map(a => a.count))) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>No action statistics available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Score Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {dashboardData.riskTrends.length > 0 ? (
              dashboardData.riskTrends.map((trend, index) => (
                <div key={index} className='flex items-center justify-between p-2 border rounded'>
                  <span className='text-sm'>{new Date(trend.date).toLocaleDateString()}</span>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-medium'>Risk: {trend.score}</span>
                    <Badge 
                      variant={trend.score > 70 ? 'destructive' : trend.score > 40 ? 'secondary' : 'default'}
                    >
                      {trend.score > 70 ? 'High' : trend.score > 40 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>No trend data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}