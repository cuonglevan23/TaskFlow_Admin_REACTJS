// ==================== ANALYTICS TYPES ====================

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

// ==================== USER ANALYTICS ====================

export interface UserAnalyticsResponseDto {
  // Current statistics
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  newUsersToday: number;
  
  // Growth rates
  monthlyGrowthRate: number;
  weeklyGrowthRate: number;
  yearlyGrowthRate: number;
  
  // Registration trends
  dailyRegistrations: AnalyticsDataPoint[];
  weeklyRegistrations: AnalyticsDataPoint[];
  monthlyRegistrations: AnalyticsDataPoint[];
  quarterlyRegistrations: AnalyticsDataPoint[];
  yearlyRegistrations: AnalyticsDataPoint[];
  
  // Login trends
  dailyLogins: AnalyticsDataPoint[];
  weeklyLogins: AnalyticsDataPoint[];
  monthlyLogins: AnalyticsDataPoint[];
  
  // User distribution
  usersByStatus: StatusDistribution[];
  usersByRole: RoleDistribution[];
  usersBySubscription: SubscriptionDistribution[];
  
  // Activity metrics
  averageSessionDuration: number;
  bounceRate: number;
  retentionRate: number;
}

export interface AnalyticsDataPoint {
  label: string;
  value: number;
  date: string;
  percentage?: number;
  change?: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SubscriptionDistribution {
  type: string;
  count: number;
  percentage: number;
  revenue: number;
  color: string;
}

export interface AnalyticsFilterDto {
  period: AnalyticsPeriod;
  count: number;
  startDate?: string;
  endDate?: string;
  includeInactive?: boolean;
}

// ==================== REVENUE ANALYTICS ====================

export interface RevenueAnalyticsResponseDto {
  // Current revenue statistics
  totalRevenue: number;
  currentMonthRevenue: number;
  todayRevenue: number;
  averageOrderValue: number;
  
  // Growth metrics
  revenueGrowthRate: number;
  monthlyGrowthRate: number;
  yearlyGrowthRate: number;
  
  // Revenue trends
  dailyRevenueData: AnalyticsDataPoint[];
  weeklyRevenueData: AnalyticsDataPoint[];
  monthlyRevenueData: AnalyticsDataPoint[];
  quarterlyRevenueData: AnalyticsDataPoint[];
  yearlyRevenueData: AnalyticsDataPoint[];
  
  // Revenue breakdown
  revenueByProduct: RevenueBreakdown[];
  revenueByCategory: RevenueBreakdown[];
  revenueBySubscription: RevenueBreakdown[];
  revenueByRegion: RevenueBreakdown[];
  
  // Payment metrics
  paymentMethods: PaymentMethodStats[];
  conversionRate: number;
  refundRate: number;
  churnRate: number;
  
  // Forecasting
  forecastedRevenue: AnalyticsDataPoint[];
  targetRevenue: number;
  revenueProgress: number;
}

export interface RevenueBreakdown {
  name: string;
  value: number;
  percentage: number;
  change: number;
  color: string;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  revenue: number;
  percentage: number;
  processingFee: number;
}

// ==================== API QUERY PARAMS ====================

export interface UserAnalyticsQueryParams {
  period?: AnalyticsPeriod;
  count?: number;
  startDate?: string;
  endDate?: string;
  includeInactive?: boolean;
}

export interface RevenueAnalyticsQueryParams {
  period?: AnalyticsPeriod;
  count?: number;
  startDate?: string;
  endDate?: string;
  currency?: string;
  includeRefunds?: boolean;
}

// ==================== DASHBOARD SUMMARY ====================

export interface AnalyticsSummaryDto {
  userAnalytics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    growthRate: number;
  };
  revenueAnalytics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageOrderValue: number;
    growthRate: number;
  };
  keyMetrics: {
    conversionRate: number;
    retentionRate: number;
    churnRate: number;
    satisfaction: number;
  };
  alerts: AnalyticsAlert[];
}

export interface AnalyticsAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  value?: number;
  threshold?: number;
  createdAt: string;
}

// ==================== CHART DATA FORMATS ====================

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  config: ChartConfig;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

// ==================== COMPARISON DATA ====================

export interface ComparisonData {
  current: AnalyticsDataPoint[];
  previous: AnalyticsDataPoint[];
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export interface BenchmarkData {
  value: number;
  benchmark: number;
  industry: number;
  performance: 'above' | 'below' | 'average';
}