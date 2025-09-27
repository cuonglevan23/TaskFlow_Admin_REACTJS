import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  IconActivity,
  IconEye,
  IconChartBar,
  IconShield
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'

import { AuditLogsProvider, useAuditLogs } from './context/audit-logs-context'
import { AuditLogsTable } from './components/audit-logs-table'
import { AuditLogsFilters } from './components/audit-logs-filters'
import { SuspiciousActivitiesDashboard } from './components/suspicious-activities-dashboard'
import { AuditLogsStatistics } from './components/audit-logs-statistics'
import { AuditLogDetailDialog } from './components/audit-log-detail-dialog'

function AuditLogsContent() {
  const { dashboardData, loading } = useAuditLogs()

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Audit Logs</h1>
          <p className='text-muted-foreground'>
            Monitor system activities and track security events
          </p>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Logs</CardTitle>
            <IconActivity className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {loading ? '...' : dashboardData.totalLogs.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              All audit entries
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
              {loading ? '...' : dashboardData.suspiciousActivities}
            </div>
            <p className='text-xs text-muted-foreground'>
              Flagged for review
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
              {loading ? '...' : dashboardData.failedOperations}
            </div>
            <p className='text-xs text-muted-foreground'>
              Error tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Critical Alerts</CardTitle>
            <IconShield className='h-4 w-4 text-destructive' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-destructive'>
              {loading ? '...' : dashboardData.criticalAlerts}
            </div>
            <p className='text-xs text-muted-foreground'>
              High risk events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue='logs' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='logs'>Audit Logs</TabsTrigger>
          <TabsTrigger value='suspicious'>Suspicious Activities</TabsTrigger>
          <TabsTrigger value='statistics'>Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value='logs' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <AuditLogsFilters />
                <AuditLogsTable />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='suspicious' className='space-y-6'>
          <SuspiciousActivitiesDashboard />
        </TabsContent>

        <TabsContent value='statistics' className='space-y-6'>
          <AuditLogsStatistics />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AuditLogDetailDialog />
    </div>
  )
}

export default function AuditLogsPage() {
  return (
    <AuditLogsProvider>
      <Layout>
        <Layout.Body>
          <AuditLogsContent />
        </Layout.Body>
      </Layout>
    </AuditLogsProvider>
  )
}