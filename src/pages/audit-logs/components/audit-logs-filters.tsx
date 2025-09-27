import { useState } from 'react'
import { useAuditLogs } from '../context/audit-logs-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  IconFilter,
  IconFilterOff,
  IconCalendar,
  IconSearch,
  IconX,
  IconDownload
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export function AuditLogsFilters() {
  const {
    filters,
    setFilters,
    resetFilters,
    exportLogs,
    exportLoading
  } = useAuditLogs()

  const [dateRange, setDateRange] = useState<{
    from?: Date
    to?: Date
  }>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined
  })

  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    action: filters.action || '',
    entityType: filters.entityType || '',
    ipAddress: filters.ipAddress || '',
    userId: filters.userId?.toString() || '',
    suspiciousOnly: filters.suspiciousOnly || false,
    success: filters.success !== undefined ? !filters.success : false // failed = !success
  })

  const auditActions: string[] = [
    'login',
    'logout',
    'create',
    'update',
    'delete',
    'view',
    'export',
    'import',
    'password_change',
    'role_change',
    'status_change'
  ]

  const entityTypes = [
    'USER',
    'ROLE',
    'PERMISSION',
    'DOCUMENT',
    'REPORT',
    'SETTING',
    'SYSTEM',
    'API',
    'DATABASE'
  ]

  const handleApplyFilters = () => {
    setFilters({
      search: localFilters.search || undefined,
      action: (localFilters.action && localFilters.action !== 'all') ? localFilters.action : undefined,
      entityType: (localFilters.entityType && localFilters.entityType !== 'all') ? localFilters.entityType : undefined,
      ipAddress: localFilters.ipAddress || undefined,
      userId: localFilters.userId ? parseInt(localFilters.userId) : undefined,
      suspiciousOnly: localFilters.suspiciousOnly || undefined,
      success: localFilters.success ? false : undefined, // if success filter is checked, we want failed operations (success=false)
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString()
    })
  }

  const handleResetFilters = () => {
    setLocalFilters({
      search: '',
      action: '',
      entityType: '',
      ipAddress: '',
      userId: '',
      suspiciousOnly: false,
      success: false
    })
    setDateRange({ from: undefined, to: undefined })
    resetFilters()
  }

  const hasActiveFilters = 
    localFilters.search ||
    localFilters.action ||
    localFilters.entityType ||
    localFilters.ipAddress ||
    localFilters.userId ||
    localFilters.suspiciousOnly ||
    localFilters.success ||
    dateRange.from ||
    dateRange.to

  const activeFiltersCount = [
    localFilters.search,
    localFilters.action,
    localFilters.entityType,
    localFilters.ipAddress,
    localFilters.userId,
    localFilters.suspiciousOnly,
    localFilters.success,
    dateRange.from,
    dateRange.to
  ].filter(Boolean).length

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <CardTitle className='text-lg'>Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant='secondary' className='text-xs'>
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={exportLogs}
              disabled={exportLoading}
            >
              <IconDownload className='h-4 w-4 mr-2' />
              Export
            </Button>
            {hasActiveFilters && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleResetFilters}
              >
                <IconFilterOff className='h-4 w-4 mr-2' />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Search and Quick Filters Row */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='search'>Search</Label>
            <div className='relative'>
              <IconSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='search'
                placeholder='Search logs...'
                value={localFilters.search}
                onChange={(e) => 
                  setLocalFilters(prev => ({ ...prev, search: e.target.value }))
                }
                className='pl-10'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Action</Label>
            <Select
              value={localFilters.action}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ ...prev, action: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='All actions' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All actions</SelectItem>
                {auditActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Entity Type</Label>
            <Select
              value={localFilters.entityType}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ ...prev, entityType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='All entities' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All entities</SelectItem>
                {entityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='ipAddress'>IP Address</Label>
            <Input
              id='ipAddress'
              placeholder='192.168.1.1'
              value={localFilters.ipAddress}
              onChange={(e) => 
                setLocalFilters(prev => ({ ...prev, ipAddress: e.target.value }))
              }
            />
          </div>
        </div>

        <Separator />

        {/* Advanced Filters Row */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='userId'>User ID</Label>
            <Input
              id='userId'
              placeholder='Enter user ID'
              value={localFilters.userId}
              onChange={(e) => 
                setLocalFilters(prev => ({ ...prev, userId: e.target.value }))
              }
            />
          </div>

          <div className='space-y-2'>
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateRange.from && 'text-muted-foreground'
                  )}
                >
                  <IconCalendar className='mr-2 h-4 w-4' />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  initialFocus
                  mode='range'
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to
                  }}
                  onSelect={(range) => 
                    setDateRange({ from: range?.from, to: range?.to })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='suspiciousOnly'
                checked={localFilters.suspiciousOnly}
                onCheckedChange={(checked) =>
                  setLocalFilters(prev => ({ ...prev, suspiciousOnly: checked }))
                }
              />
              <Label htmlFor='suspiciousOnly' className='text-sm'>
                Only suspicious activities
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='failedOnly'
                checked={localFilters.success}
                onCheckedChange={(checked) =>
                  setLocalFilters(prev => ({ ...prev, success: checked }))
                }
              />
              <Label htmlFor='failedOnly' className='text-sm'>
                Only failed operations
              </Label>
            </div>
          </div>

          <div className='flex items-end'>
            <Button 
              onClick={handleApplyFilters}
              className='w-full'
            >
              <IconFilter className='h-4 w-4 mr-2' />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Active Filters:</Label>
              <div className='flex flex-wrap gap-2'>
                {localFilters.search && (
                  <Badge variant='secondary' className='px-2 py-1'>
                    Search: {localFilters.search}
                    <IconX 
                      className='ml-1 h-3 w-3 cursor-pointer' 
                      onClick={() => 
                        setLocalFilters(prev => ({ ...prev, search: '' }))
                      }
                    />
                  </Badge>
                )}
                {localFilters.action && (
                  <Badge variant='secondary' className='px-2 py-1'>
                    Action: {localFilters.action}
                    <IconX 
                      className='ml-1 h-3 w-3 cursor-pointer' 
                      onClick={() => 
                        setLocalFilters(prev => ({ ...prev, action: '' }))
                      }
                    />
                  </Badge>
                )}
                {localFilters.entityType && (
                  <Badge variant='secondary' className='px-2 py-1'>
                    Entity: {localFilters.entityType}
                    <IconX 
                      className='ml-1 h-3 w-3 cursor-pointer' 
                      onClick={() => 
                        setLocalFilters(prev => ({ ...prev, entityType: '' }))
                      }
                    />
                  </Badge>
                )}
                {localFilters.ipAddress && (
                  <Badge variant='secondary' className='px-2 py-1'>
                    IP: {localFilters.ipAddress}
                    <IconX 
                      className='ml-1 h-3 w-3 cursor-pointer' 
                      onClick={() => 
                        setLocalFilters(prev => ({ ...prev, ipAddress: '' }))
                      }
                    />
                  </Badge>
                )}
                {localFilters.suspiciousOnly && (
                  <Badge variant='destructive' className='px-2 py-1'>
                    Suspicious Only
                    <IconX 
                      className='ml-1 h-3 w-3 cursor-pointer' 
                      onClick={() => 
                        setLocalFilters(prev => ({ ...prev, suspiciousOnly: false }))
                      }
                    />
                  </Badge>
                )}
                {localFilters.success && (
                  <Badge variant='destructive' className='px-2 py-1'>
                    Failed Only
                    <IconX 
                      className='ml-1 h-3 w-3 cursor-pointer' 
                      onClick={() => 
                        setLocalFilters(prev => ({ ...prev, success: false }))
                      }
                    />
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}