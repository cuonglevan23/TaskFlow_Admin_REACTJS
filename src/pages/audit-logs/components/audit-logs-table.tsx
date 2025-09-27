import { useState } from 'react'
import { useAuditLogs } from '../context/audit-logs-context'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/custom/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  IconDots, 
  IconEye, 
  IconUser,
  IconCalendar,
  IconAlertTriangle,
  IconShield,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'
import { AuditLogResponseDto } from '@/types/audit.types'
import { formatAuditAction, getActionColor, getSuccessColor } from '@/api/auditApi'

export function AuditLogsTable() {
  const { 
    auditLogs, 
    loading, 
    pagination, 
    setPage,
    setCurrentLog,
    openDialog
  } = useAuditLogs()

  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleViewDetails = (log: AuditLogResponseDto) => {
    setCurrentLog(log)
    openDialog('detail')
  }

  const truncateText = (text: string | null | undefined, maxLength: number = 50) => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className='flex items-center space-x-4'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div className='space-y-2 flex-1'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!auditLogs.length) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <IconEye className='mx-auto h-12 w-12 text-muted-foreground/50 mb-4' />
          <h3 className='text-lg font-semibold mb-2'>No audit logs found</h3>
          <p className='text-muted-foreground'>
            Try adjusting your filters or date range to see more results.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[60px]'>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className='w-[50px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    hoveredRow === log.id ? 'bg-muted/30' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(log.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => handleViewDetails(log)}
                >
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={undefined} />
                        <AvatarFallback className='text-xs'>
                          {getInitials(log.userFullName || log.userEmail || 'Unknown')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className='space-y-1'>
                      <Badge variant='outline' className={getActionColor(log.action)}>
                        {formatAuditAction(log.action)}
                      </Badge>
                      <p className='text-sm text-muted-foreground'>
                        {truncateText(log.details)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='space-y-1'>
                      <div className='flex items-center space-x-1'>
                        <Badge variant='secondary'>{log.entityType}</Badge>
                      </div>
                      {log.entityId && (
                        <p className='text-sm text-muted-foreground'>
                          {truncateText(log.entityId, 30)}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <code className='text-xs bg-muted px-1 py-0.5 rounded'>
                      {log.ipAddress}
                    </code>
                  </TableCell>

                  <TableCell>
                    <Badge 
                      variant='outline' 
                      className={getSuccessColor(log.success)}
                    >
                      {log.success ? (
                        <div className='flex items-center space-x-1'>
                          <IconShield size={12} />
                          <span>Success</span>
                        </div>
                      ) : (
                        <div className='flex items-center space-x-1'>
                          <IconAlertTriangle size={12} />
                          <span>Failed</span>
                        </div>
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {log.severity === 'HIGH' || log.severity === 'CRITICAL' ? (
                      <Badge 
                        variant='outline' 
                        className={log.severity === 'CRITICAL' ? 'text-red-600 bg-red-50 border-red-200' : 'text-orange-600 bg-orange-50 border-orange-200'}
                      >
                        <IconAlertTriangle size={12} className='mr-1' />
                        {log.severity}
                      </Badge>
                    ) : (
                      <Badge variant='outline' className='text-green-600 bg-green-50 border-green-200'>
                        Safe
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className='flex items-center space-x-1 text-sm text-muted-foreground'>
                      <IconCalendar size={12} />
                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconDots className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(log)}>
                          <IconEye className='mr-2 h-4 w-4' />
                          View Details
                        </DropdownMenuItem>
                        {log.userId && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: Navigate to user details
                              }}
                            >
                              <IconUser className='mr-2 h-4 w-4' />
                              View User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Simple Pagination */}
      <div className='flex items-center justify-between px-2'>
        <div className='text-sm text-muted-foreground'>
          Showing {pagination.page * pagination.size + 1} to{' '}
          {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
          {pagination.totalElements} entries
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(Math.max(0, pagination.page - 1))}
            disabled={pagination.first}
          >
            <IconChevronLeft className='h-4 w-4' />
            Previous
          </Button>
          <span className='text-sm'>
            Page {pagination.page + 1} of {pagination.totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(Math.min(pagination.totalPages - 1, pagination.page + 1))}
            disabled={pagination.last}
          >
            Next
            <IconChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}