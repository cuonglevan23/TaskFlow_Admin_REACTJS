import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  AuditLogResponseDto,
  AuditLogQueryParams,
  PaginatedAuditLogsResponse,
  SuspiciousActivitiesResponse,
  AuditStatisticsResponse
} from '@/types/audit.types'
import { 
  getAuditLogs,
  getSuspiciousActivities,
  getAuditStatistics,
  exportAuditLogs
} from '@/api/auditApi'

export type AuditLogsDialogType = 'detail' | 'export'

export interface AuditLogsContextType {
  // Data
  auditLogs: AuditLogResponseDto[]
  loading: boolean
  error: string | null
  
  // Pagination
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
  }
  setPage: (page: number) => void
  
  // Filters
  filters: AuditLogQueryParams
  setFilters: (filters: Partial<AuditLogQueryParams>) => void
  resetFilters: () => void
  
  // Export
  exportLogs: () => Promise<void>
  exportLoading: boolean
  
  // Dashboard data
  dashboardData: {
    totalLogs: number
    suspiciousActivities: number
    failedOperations: number
    activeUsers: number
    criticalAlerts: number
    topActions: Array<{ action: string; count: number }>
    recentActivities: Array<{ time: string; activity: string; user: string }>
    riskTrends: Array<{ date: string; score: number }>
  }
  
  // Dialogs
  // Selected log for detail view
  currentLog: AuditLogResponseDto | null
  setCurrentLog: (log: AuditLogResponseDto | null) => void
  dialogStates: {
    detail: boolean
    export: boolean
  }
  openDialog: (type: AuditLogsDialogType) => void
  closeDialog: (type: AuditLogsDialogType) => void
  
  // Refresh all data
  refresh: () => Promise<void>
}

const AuditLogsContext = createContext<AuditLogsContextType | undefined>(undefined)

export const useAuditLogs = () => {
  const context = useContext(AuditLogsContext)
  if (!context) {
    throw new Error('useAuditLogs must be used within an AuditLogsProvider')
  }
  return context
}

export const AuditLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for audit logs list
  const [auditLogs, setAuditLogs] = useState<AuditLogResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  })

  // Filters
  const [filters, setFiltersState] = useState<AuditLogQueryParams>({
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortDir: 'desc'
  })

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState({
    totalLogs: 0,
    suspiciousActivities: 0,
    failedOperations: 0,
    activeUsers: 0,
    criticalAlerts: 0,
    topActions: [] as Array<{ action: string; count: number }>,
    recentActivities: [] as Array<{ time: string; activity: string; user: string }>,
    riskTrends: [] as Array<{ date: string; score: number }>
  })

  // Dialog states
  const [currentLog, setCurrentLog] = useState<AuditLogResponseDto | null>(null)
  const [dialogStates, setDialogStates] = useState({
    detail: false,
    export: false
  })

  // API Functions
  const fetchAuditLogs = async (queryParams?: AuditLogQueryParams) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: PaginatedAuditLogsResponse = await getAuditLogs(queryParams || filters)
      
      if (!response) {
        console.error('❌ [AuditLogsContext] Response is null/undefined')
        setError('No data received from server')
        return
      }
      
      setAuditLogs(response.content || [])
      setPagination({
        page: response.pageable?.pageNumber || 0,
        size: response.pageable?.pageSize || 20,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        first: response.first || true,
        last: response.last || true
      })
    } catch (error) {
      console.error('❌ [AuditLogsContext] Error fetching audit logs:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const suspiciousResponse = await getSuspiciousActivities(24 * 30, 50) // 30 days, threshold 50
      
      const statisticsResponse = await getAuditStatistics(30) // 30 days

      const dashboardDataCalculated = {
        totalLogs: (statisticsResponse as any)?.totalActivities || 0,
        suspiciousActivities: (suspiciousResponse as any)?.totalSuspiciousUsers || 0,
        failedOperations: (suspiciousResponse as any)?.failedLoginAttempts || 0,
        activeUsers: (statisticsResponse as any)?.uniqueUsers || 0,
        criticalAlerts: 0, // Need to check what field represents this
        topActions: Object.entries((statisticsResponse as any)?.actionBreakdown || {}).map(([action, count]) => ({
          action,
          count: count as number
        })),
        recentActivities: [], // Will be populated by recent activities API
        riskTrends: [] // Will be populated by trends API
      }
      
      setDashboardData(dashboardDataCalculated)
    } catch (error) {
      console.error('❌ [AuditLogsContext] Error fetching dashboard data:', error)
    }
  }

  // Handler functions
  const setFilters = (newFilters: Partial<AuditLogQueryParams>) => {
    setFiltersState((prev: any) => ({ ...prev, ...newFilters, page: 0 }))
  }

  const resetFilters = () => {
    setFiltersState({
      page: 0,
      size: 20,
      sortBy: 'createdAt',
      sortDir: 'desc'
    })
  }

  const setPage = (page: number) => {
    setFiltersState((prev: any) => ({ ...prev, page }))
  }

  const exportLogs = async () => {
    try {
      setExportLoading(true)
      await exportAuditLogs({
        format: 'EXCEL',
        filters: filters,
        includeDetails: true
      })
    } catch (error) {
      console.error('Error exporting logs:', error)
      setError(error instanceof Error ? error.message : 'Failed to export logs')
    } finally {
      setExportLoading(false)
    }
  }

  const openDialog = (type: AuditLogsDialogType) => {
    setDialogStates(prev => ({ ...prev, [type]: true }))
  }

  const closeDialog = (type: AuditLogsDialogType) => {
    setDialogStates(prev => ({ ...prev, [type]: false }))
    if (type === 'detail') {
      setCurrentLog(null)
    }
  }

  const refresh = async () => {
    await Promise.all([
      fetchAuditLogs(),
      fetchDashboardData()
    ])
  }

  // Effects
  useEffect(() => {
    fetchAuditLogs()
  }, [filters])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const contextValue: AuditLogsContextType = {
    // Data
    auditLogs,
    loading,
    error,
    
    // Pagination
    pagination,
    setPage,
    
    // Filters
    filters,
    setFilters,
    resetFilters,
    
    // Export
    exportLogs,
    exportLoading,
    
    // Dashboard data
    dashboardData,
    
    // Dialogs
    currentLog,
    setCurrentLog,
    dialogStates,
    openDialog,
    closeDialog,
    
    // Refresh
    refresh
  }

  return (
    <AuditLogsContext.Provider value={contextValue}>
      {children}
    </AuditLogsContext.Provider>
  )
}