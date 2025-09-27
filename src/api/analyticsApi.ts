// API functions for analytics management
import api from './axios.customize';
import type { 
  UserAnalyticsResponseDto,
  UserAnalyticsQueryParams,
  AnalyticsDataPoint,
  ChartData
} from '../types/analytics.types';
import type {
  PaymentDashboardResponse,
  RevenueStatisticsResponse,
  RevenueStatisticsQueryParams,
  SubscriptionAnalyticsResponse,
  SubscriptionAnalyticsQueryParams,
  RevenueTrendsResponse,
  RevenueTrendsQueryParams,
  PremiumUsersResponse,
  PremiumUsersQueryParams,
  PackagePerformance,
  PackagePerformanceQueryParams,
  ChurnAnalysisResponse,
  ChurnAnalysisQueryParams,
  AnalyticsSummary,
  ExportParams,
  UserExportParams
} from '../types/payment.types';

// ==================== USER ANALYTICS API FUNCTIONS ====================

/**
 * Get comprehensive user analytics data
 */
export const getUserAnalytics = async (params?: UserAnalyticsQueryParams): Promise<UserAnalyticsResponseDto> => {
  const queryParams = new URLSearchParams();
  
  if (params?.period) queryParams.append('period', params.period);
  if (params?.count !== undefined) queryParams.append('count', params.count.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.includeInactive !== undefined) queryParams.append('includeInactive', params.includeInactive.toString());
  
  const url = `/admin/analytics/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get current user statistics
 */
export const getCurrentUserStats = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  newUsersToday: number;
  monthlyGrowthRate: number;
}> => {
  const response = await api.get('/admin/analytics/users/current');
  return response.data;
};

/**
 * Get user registration trends
 */
export const getUserRegistrationTrends = async (params?: {
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  count?: number;
}): Promise<{
  dailyData?: AnalyticsDataPoint[];
  weeklyData?: AnalyticsDataPoint[];
  monthlyData?: AnalyticsDataPoint[];
  quarterlyData?: AnalyticsDataPoint[];
  yearlyData?: AnalyticsDataPoint[];
}> => {
  const queryParams = new URLSearchParams();
  
  if (params?.period) queryParams.append('period', params.period);
  if (params?.count !== undefined) queryParams.append('count', params.count.toString());
  
  const url = `/admin/analytics/users/registrations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get user login activity trends
 */
export const getUserLoginTrends = async (params?: {
  period?: 'day' | 'week' | 'month';
  count?: number;
}): Promise<{
  dailyLogins?: AnalyticsDataPoint[];
  weeklyLogins?: AnalyticsDataPoint[];
  monthlyLogins?: AnalyticsDataPoint[];
}> => {
  const queryParams = new URLSearchParams();
  
  if (params?.period) queryParams.append('period', params.period);
  if (params?.count !== undefined) queryParams.append('count', params.count.toString());
  
  const url = `/admin/analytics/users/logins${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

// ==================== PAYMENT DASHBOARD API FUNCTIONS ====================

/**
 * Get payment dashboard with revenue, subscription, and user analytics
 */
export const getPaymentDashboard = async (days: number = 30): Promise<PaymentDashboardResponse> => {
  const response = await api.get(`/payments/admin/dashboard?days=${days}`);
  
  // Backend trả dữ liệu trực tiếp trong response thay vì response.data
  const data = response.data || response;
  
  return data;
};

/**
 * Get comprehensive revenue statistics
 */
export const getRevenueStatistics = async (params?: RevenueStatisticsQueryParams): Promise<RevenueStatisticsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.periodType) queryParams.append('periodType', params.periodType);
  if (params?.includeTrends !== undefined) queryParams.append('includeTrends', params.includeTrends.toString());
  
  const url = `/payments/admin/revenue/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get subscription analytics data
 */
export const getSubscriptionAnalytics = async (params?: SubscriptionAnalyticsQueryParams): Promise<SubscriptionAnalyticsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.days !== undefined) queryParams.append('days', params.days.toString());
  if (params?.includeChurn !== undefined) queryParams.append('includeChurn', params.includeChurn.toString());
  if (params?.includePremiumUsers !== undefined) queryParams.append('includePremiumUsers', params.includePremiumUsers.toString());
  
  const url = `/payments/admin/subscriptions/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get revenue trends over time
 */
export const getRevenueTrends = async (params?: RevenueTrendsQueryParams): Promise<RevenueTrendsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.days !== undefined) queryParams.append('days', params.days.toString());
  if (params?.includeForecast !== undefined) queryParams.append('includeForecast', params.includeForecast.toString());
  
  const url = `/payments/admin/revenue/trends${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get premium users list
 */
export const getPremiumUsers = async (params?: PremiumUsersQueryParams): Promise<PremiumUsersResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);
  if (params?.planType) queryParams.append('planType', params.planType);
  if (params?.riskLevel) queryParams.append('riskLevel', params.riskLevel);
  
  const url = `/payments/admin/users/premium${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get package performance data
 */
export const getPackagePerformance = async (params?: PackagePerformanceQueryParams): Promise<PackagePerformance[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.days !== undefined) queryParams.append('days', params.days.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  
  const url = `/payments/admin/packages/performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Get churn analysis data
 */
export const getChurnAnalysis = async (params?: ChurnAnalysisQueryParams): Promise<ChurnAnalysisResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.days !== undefined) queryParams.append('days', params.days.toString());
  
  const url = `/payments/admin/churn/analysis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

// ==================== DASHBOARD SUMMARY ====================

/**
 * Get analytics summary combining payment dashboard data
 */
export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const response = await getPaymentDashboard(30);
  
  // Defensive programming to handle potential undefined values
  const overview = response?.overview || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalSubscriptions: 0,
    activeUsers: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    lastUpdated: new Date().toISOString()
  };
  
  const kpis = response?.kpis || [];
  
  return {
    overview,
    kpis
  };
};

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export revenue analytics data
 */
export const exportRevenueAnalytics = async (params: ExportParams): Promise<void> => {
  const queryParams = new URLSearchParams();
  
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);
  if (params?.format) queryParams.append('format', params.format);
  
  const url = `/payments/admin/revenue/export?${queryParams.toString()}`;
  const response = await api.get(url, { responseType: 'blob' });
  
  // Create download link
  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `revenue-analytics-${params.startDate}-to-${params.endDate}.${params?.format?.toLowerCase() || 'csv'}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Export user analytics data
 */
export const exportUserAnalytics = async (params?: UserExportParams): Promise<void> => {
  const queryParams = new URLSearchParams();
  
  if (params?.format) queryParams.append('format', params.format);
  if (params?.period) queryParams.append('period', params.period);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  
  const url = `/admin/analytics/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url, { responseType: 'blob' });
  
  // Create download link
  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `user-analytics-${new Date().toISOString().split('T')[0]}.${params?.format?.toLowerCase() || 'csv'}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format numbers for display
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

/**
 * Format currency for display
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

/**
 * Get color for trend
 */
export const getTrendColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Get icon for trend
 */
export const getTrendIcon = (value: number): '↗️' | '↘️' | '➡️' => {
  if (value > 0) return '↗️';
  if (value < 0) return '↘️';
  return '➡️';
};

/**
 * Convert analytics data to chart format
 */
export const convertToChartData = (
  data: AnalyticsDataPoint[],
  label: string,
  color: string = '#3B82F6'
): ChartData => {
  return {
    labels: data.map(point => point.label),
    datasets: [{
      label,
      data: data.map(point => point.value),
      backgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      fill: false
    }],
    config: {
      type: 'line',
      title: label,
      showLegend: true,
      showGrid: true
    }
  };
};