import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  UserAnalyticsResponseDto,
  UserAnalyticsQueryParams,
  AnalyticsPeriod
} from '@/types/analytics.types'
import {
  PaymentDashboardResponse,
  RevenueStatisticsResponse,
  RevenueStatisticsQueryParams,
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsQueryParams,
  RevenueTrendsResponse,
  PremiumUsersResponse,
  PackagePerformance,
  ChurnAnalysisResponse,
  AnalyticsSummary
} from '@/types/payment.types'
import { 
  getUserAnalytics,
  getPaymentDashboard,
  getRevenueStatistics,
  getSubscriptionAnalytics,
  getRevenueTrends,
  getPremiumUsers,
  getPackagePerformance,
  getChurnAnalysis,
  getAnalyticsSummary,
  getCurrentUserStats,
  exportUserAnalytics,
  exportRevenueAnalytics
} from '@/api/analyticsApi'

export interface AnalyticsContextType {
  // Data
  userAnalytics: UserAnalyticsResponseDto | null
  paymentDashboard: PaymentDashboardResponse | null
  revenueStatistics: RevenueStatisticsResponse | null
  subscriptionAnalytics: SubscriptionAnalyticsResponse | null
  revenueTrends: RevenueTrendsResponse | null
  premiumUsers: PremiumUsersResponse | null
  packagePerformance: PackagePerformance[] | null
  churnAnalysis: ChurnAnalysisResponse | null
  summary: AnalyticsSummary | null
  
  // Loading states
  userLoading: boolean
  paymentLoading: boolean
  revenueLoading: boolean
  subscriptionLoading: boolean
  trendsLoading: boolean
  premiumUsersLoading: boolean
  packageLoading: boolean
  churnLoading: boolean
  summaryLoading: boolean
  exportLoading: boolean
  
  // Error states
  userError: string | null
  paymentError: string | null
  revenueError: string | null
  subscriptionError: string | null
  trendsError: string | null
  premiumUsersError: string | null
  packageError: string | null
  churnError: string | null
  summaryError: string | null
  
  // Filters
  userFilters: UserAnalyticsQueryParams
  revenueFilters: RevenueStatisticsQueryParams
  subscriptionFilters: SubscriptionAnalyticsQueryParams
  selectedPeriod: AnalyticsPeriod
  
  // Actions
  setUserFilters: (filters: Partial<UserAnalyticsQueryParams>) => void
  setRevenueFilters: (filters: Partial<RevenueStatisticsQueryParams>) => void
  setSubscriptionFilters: (filters: Partial<SubscriptionAnalyticsQueryParams>) => void
  setPeriod: (period: AnalyticsPeriod) => void
  refreshUserAnalytics: () => Promise<void>
  refreshPaymentDashboard: () => Promise<void>
  refreshRevenueStatistics: () => Promise<void>
  refreshSubscriptionAnalytics: () => Promise<void>
  refreshRevenueTrends: () => Promise<void>
  refreshPremiumUsers: () => Promise<void>
  refreshPackagePerformance: () => Promise<void>
  refreshChurnAnalysis: () => Promise<void>
  refreshSummary: () => Promise<void>
  exportUserData: (format?: 'CSV' | 'EXCEL' | 'PDF') => Promise<void>
  exportRevenueData: (startDate: string, endDate: string, format?: 'CSV' | 'EXCEL' | 'PDF') => Promise<void>
  
  // Current stats (for quick display)
  currentUserStats: {
    totalUsers: number
    activeUsers: number
    onlineUsers: number
    newUsersToday: number
    monthlyGrowthRate: number
  } | null
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsResponseDto | null>(null)
  const [paymentDashboard, setPaymentDashboard] = useState<PaymentDashboardResponse | null>(null)
  const [revenueStatistics, setRevenueStatistics] = useState<RevenueStatisticsResponse | null>(null)
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState<SubscriptionAnalyticsResponse | null>(null)
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrendsResponse | null>(null)
  const [premiumUsers, setPremiumUsers] = useState<PremiumUsersResponse | null>(null)
  const [packagePerformance, setPackagePerformance] = useState<PackagePerformance[] | null>(null)
  const [churnAnalysis, setChurnAnalysis] = useState<ChurnAnalysisResponse | null>(null)
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  
  // Loading states
  const [userLoading, setUserLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [revenueLoading, setRevenueLoading] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const [trendsLoading, setTrendsLoading] = useState(false)
  const [premiumUsersLoading, setPremiumUsersLoading] = useState(false)
  const [packageLoading, setPackageLoading] = useState(false)
  const [churnLoading, setChurnLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  
  // Error states
  const [userError, setUserError] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [revenueError, setRevenueError] = useState<string | null>(null)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [trendsError, setTrendsError] = useState<string | null>(null)
  const [premiumUsersError, setPremiumUsersError] = useState<string | null>(null)
  const [packageError, setPackageError] = useState<string | null>(null)
  const [churnError, setChurnError] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  
  // Current stats (extracted from payment dashboard)
  const [currentUserStats, setCurrentUserStats] = useState<{
    totalUsers: number
    activeUsers: number
    onlineUsers: number
    newUsersToday: number
    monthlyGrowthRate: number
  } | null>(null)
  
  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>('month')
  const [userFilters, setUserFiltersState] = useState<UserAnalyticsQueryParams>({
    period: 'month',
    count: 12,
    includeInactive: false
  })
  const [revenueFilters, setRevenueFiltersState] = useState<RevenueStatisticsQueryParams>({
    periodType: 'MONTHLY',
    includeTrends: true
  })
  const [subscriptionFilters, setSubscriptionFiltersState] = useState<SubscriptionAnalyticsQueryParams>({
    days: 30,
    includeChurn: true,
    includePremiumUsers: true
  })

  // Filter setters
  const setUserFilters = (newFilters: Partial<UserAnalyticsQueryParams>) => {
    setUserFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const setRevenueFilters = (newFilters: Partial<RevenueStatisticsQueryParams>) => {
    setRevenueFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const setSubscriptionFilters = (newFilters: Partial<SubscriptionAnalyticsQueryParams>) => {
    setSubscriptionFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const setPeriod = (period: AnalyticsPeriod) => {
    setSelectedPeriod(period)
    setUserFilters({ period })
    // Convert period to periodType for revenue filters
    const periodType = period === 'day' ? 'DAILY' : 
                      period === 'week' ? 'WEEKLY' : 
                      period === 'month' ? 'MONTHLY' : 'YEARLY'
    setRevenueFilters({ periodType })
  }

  // Fetch functions
  const refreshUserAnalytics = async () => {
    try {
      setUserLoading(true)
      setUserError(null)
      const data = await getUserAnalytics(userFilters)
      setUserAnalytics(data)
    } catch (error) {
      setUserError(error instanceof Error ? error.message : 'Failed to fetch user analytics')
      console.error('User analytics fetch error:', error)
    } finally {
      setUserLoading(false)
    }
  }

  const refreshPaymentDashboard = async () => {
    try {
      setPaymentLoading(true)
      setPaymentError(null)
      const data = await getPaymentDashboard(30)
      setPaymentDashboard(data)
      
      // Extract current stats from payment dashboard with defensive checks
      if (data?.overview && data?.realtime) {
        setCurrentUserStats({
          totalUsers: data.overview.activeUsers || 0,
          activeUsers: data.overview.activeUsers || 0,
          onlineUsers: data.realtime.onlineUsers || 0,
          newUsersToday: data.realtime.todaySignups || 0,
          monthlyGrowthRate: 0 // Calculate from data if available
        })
      } else {
        // Set default values if structure is unexpected
        setCurrentUserStats({
          totalUsers: 0,
          activeUsers: 0,
          onlineUsers: 0,
          newUsersToday: 0,
          monthlyGrowthRate: 0
        })
      }
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Failed to fetch payment dashboard')
      console.error('Payment dashboard fetch error:', error)
    } finally {
      setPaymentLoading(false)
    }
  }

  const refreshRevenueStatistics = async () => {
    try {
      setRevenueLoading(true)
      setRevenueError(null)
      const data = await getRevenueStatistics(revenueFilters)
      setRevenueStatistics(data)
    } catch (error) {
      setRevenueError(error instanceof Error ? error.message : 'Failed to fetch revenue statistics')
      console.error('Revenue statistics fetch error:', error)
    } finally {
      setRevenueLoading(false)
    }
  }

  const refreshSubscriptionAnalytics = async () => {
    try {
      setSubscriptionLoading(true)
      setSubscriptionError(null)
      const data = await getSubscriptionAnalytics(subscriptionFilters)
      setSubscriptionAnalytics(data)
    } catch (error) {
      setSubscriptionError(error instanceof Error ? error.message : 'Failed to fetch subscription analytics')
      console.error('Subscription analytics fetch error:', error)
    } finally {
      setSubscriptionLoading(false)
    }
  }

  const refreshRevenueTrends = async () => {
    try {
      setTrendsLoading(true)
      setTrendsError(null)
      const data = await getRevenueTrends({ days: 90, includeForecast: true })
      setRevenueTrends(data)
    } catch (error) {
      setTrendsError(error instanceof Error ? error.message : 'Failed to fetch revenue trends')
      console.error('Revenue trends fetch error:', error)
    } finally {
      setTrendsLoading(false)
    }
  }

  const refreshPremiumUsers = async () => {
    try {
      setPremiumUsersLoading(true)
      setPremiumUsersError(null)
      const data = await getPremiumUsers({ page: 0, size: 20 })
      setPremiumUsers(data)
    } catch (error) {
      setPremiumUsersError(error instanceof Error ? error.message : 'Failed to fetch premium users')
      console.error('Premium users fetch error:', error)
    } finally {
      setPremiumUsersLoading(false)
    }
  }

  const refreshPackagePerformance = async () => {
    try {
      setPackageLoading(true)
      setPackageError(null)
      const data = await getPackagePerformance({ days: 30 })
      setPackagePerformance(data)
    } catch (error) {
      setPackageError(error instanceof Error ? error.message : 'Failed to fetch package performance')
      console.error('Package performance fetch error:', error)
    } finally {
      setPackageLoading(false)
    }
  }

  const refreshChurnAnalysis = async () => {
    try {
      setChurnLoading(true)
      setChurnError(null)
      const data = await getChurnAnalysis({ days: 60 })
      setChurnAnalysis(data)
    } catch (error) {
      setChurnError(error instanceof Error ? error.message : 'Failed to fetch churn analysis')
      console.error('Churn analysis fetch error:', error)
    } finally {
      setChurnLoading(false)
    }
  }

  const refreshSummary = async () => {
    try {
      setSummaryLoading(true)
      setSummaryError(null)
      const data = await getAnalyticsSummary()
      setSummary(data)
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Failed to fetch analytics summary')
      console.error('Analytics summary fetch error:', error)
    } finally {
      setSummaryLoading(false)
    }
  }

  // Fetch current stats (combine user stats and payment dashboard)
  const fetchCurrentStats = async () => {
    try {
      const userStats = await getCurrentUserStats().catch(() => null)
      if (userStats) setCurrentUserStats(userStats)
      
      // Also fetch payment dashboard for comprehensive stats
      await refreshPaymentDashboard()
    } catch (error) {
      console.error('Current stats fetch error:', error)
    }
  }

  // Export functions
  const exportUserData = async (format: 'CSV' | 'EXCEL' | 'PDF' = 'EXCEL') => {
    try {
      setExportLoading(true)
      await exportUserAnalytics({
        format,
        period: userFilters.period,
        startDate: userFilters.startDate,
        endDate: userFilters.endDate
      })
    } catch (error) {
      console.error('User analytics export error:', error)
    } finally {
      setExportLoading(false)
    }
  }

  const exportRevenueData = async (
    startDate: string, 
    endDate: string, 
    format: 'CSV' | 'EXCEL' | 'PDF' = 'EXCEL'
  ) => {
    try {
      setExportLoading(true)
      await exportRevenueAnalytics({
        startDate,
        endDate,
        format
      })
    } catch (error) {
      console.error('Revenue analytics export error:', error)
    } finally {
      setExportLoading(false)
    }
  }

  // Effects
  useEffect(() => {
    refreshUserAnalytics()
  }, [userFilters])

  useEffect(() => {
    refreshRevenueStatistics()
  }, [revenueFilters])

  useEffect(() => {
    refreshSubscriptionAnalytics()
  }, [subscriptionFilters])

  useEffect(() => {
    refreshSummary()
    fetchCurrentStats()
    refreshRevenueTrends()
    refreshPremiumUsers()
    refreshPackagePerformance()
    refreshChurnAnalysis()
  }, [])

  const value: AnalyticsContextType = {
    // Data
    userAnalytics,
    paymentDashboard,
    revenueStatistics,
    subscriptionAnalytics,
    revenueTrends,
    premiumUsers,
    packagePerformance,
    churnAnalysis,
    summary,
    
    // Loading states
    userLoading,
    paymentLoading,
    revenueLoading,
    subscriptionLoading,
    trendsLoading,
    premiumUsersLoading,
    packageLoading,
    churnLoading,
    summaryLoading,
    exportLoading,
    
    // Error states
    userError,
    paymentError,
    revenueError,
    subscriptionError,
    trendsError,
    premiumUsersError,
    packageError,
    churnError,
    summaryError,
    
    // Filters
    userFilters,
    revenueFilters,
    subscriptionFilters,
    selectedPeriod,
    
    // Actions
    setUserFilters,
    setRevenueFilters,
    setSubscriptionFilters,
    setPeriod,
    refreshUserAnalytics,
    refreshPaymentDashboard,
    refreshRevenueStatistics,
    refreshSubscriptionAnalytics,
    refreshRevenueTrends,
    refreshPremiumUsers,
    refreshPackagePerformance,
    refreshChurnAnalysis,
    refreshSummary,
    exportUserData,
    exportRevenueData,
    
    // Current stats
    currentUserStats
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}