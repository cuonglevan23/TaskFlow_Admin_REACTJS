import { useAuditLogs } from '../context/audit-logs-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatAuditAction, getActionColor, getSuccessColor } from '@/api/auditApi'
import { 
  IconUser,
  IconCalendar,
  IconMapPin,
  IconShield,
  IconAlertTriangle,
  IconActivity
} from '@tabler/icons-react'

export function AuditLogDetailDialog() {
  const { currentLog, dialogStates, closeDialog } = useAuditLogs()

  if (!currentLog) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }


  return (
    <Dialog
      open={dialogStates.detail}
      onOpenChange={(open) => {
        if (!open) closeDialog('detail')
      }}
    >
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Comprehensive information about this audit log entry
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Header with Action and Status */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Badge variant='outline' className={getActionColor(currentLog.action)}>
                {formatAuditAction(currentLog.action)}
              </Badge>
              <Badge 
                variant='outline' 
                className={getSuccessColor(currentLog.success)}
              >
                {currentLog.success ? 'Success' : 'Failed'}
              </Badge>
              {currentLog.severity === 'HIGH' || currentLog.severity === 'CRITICAL' && (
                <Badge 
                  variant='outline' 
                  className={currentLog.severity === 'CRITICAL' ? 'text-red-600 bg-red-50 border-red-200' : 'text-orange-600 bg-orange-50 border-orange-200'}
                >
                  <IconAlertTriangle size={12} className='mr-1' />
                  Risk: {currentLog.severity}
                </Badge>
              )}
            </div>
          </div>

          {/* User Information */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-lg flex items-center'>
                <IconUser className='mr-2 h-5 w-5' />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    User ID
                  </label>
                  <p className='text-sm font-mono'>
                    {currentLog.userId || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Username
                  </label>
                  <p className='text-sm'>
                    {currentLog.userFullName || currentLog.userEmail || 'Unknown'}
                  </p>
                </div>
                <div className='col-span-2'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email
                  </label>
                  <p className='text-sm'>
                    {currentLog.userEmail || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Details */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-lg flex items-center'>
                <IconActivity className='mr-2 h-5 w-5' />
                Action Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Description
                </label>
                <p className='text-sm'>
                  {currentLog.details}
                </p>
              </div>
              
              <Separator />
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Entity Type
                  </label>
                  <Badge variant='secondary'>
                    {currentLog.entityType}
                  </Badge>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Entity ID
                  </label>
                  <p className='text-sm font-mono'>
                    {currentLog.entityId || 'N/A'}
                  </p>
                </div>
              </div>
              
              {currentLog.entityId && (
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Entity ID
                  </label>
                  <p className='text-sm'>
                    {currentLog.entityId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Information */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-lg flex items-center'>
                <IconMapPin className='mr-2 h-5 w-5' />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    IP Address
                  </label>
                  <code className='text-sm bg-muted px-2 py-1 rounded'>
                    {currentLog.ipAddress}
                  </code>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Session ID
                  </label>
                  <p className='text-sm font-mono'>
                    {currentLog.sessionId || 'N/A'}
                  </p>
                </div>
              </div>
              
              {currentLog.userAgent && (
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    User Agent
                  </label>
                  <p className='text-sm text-muted-foreground break-all'>
                    {currentLog.userAgent}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-lg flex items-center'>
                <IconShield className='mr-2 h-5 w-5' />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Log Level
                  </label>
                  <Badge variant='outline'>
                    {currentLog.severity}
                  </Badge>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Timestamp
                  </label>
                  <div className='flex items-center space-x-1'>
                    <IconCalendar size={14} />
                    <p className='text-sm'>
                      {formatDate(currentLog.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error handling details can be added based on details field */}
              {currentLog.details && !currentLog.success && (
                <div>
                  <label className='text-sm font-medium text-destructive'>
                    Error Details
                  </label>
                  <p className='text-sm text-destructive bg-destructive/10 p-2 rounded'>
                    {currentLog.details}
                  </p>
                </div>
              )}

              {/* Metadata can be parsed from details if needed */}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}