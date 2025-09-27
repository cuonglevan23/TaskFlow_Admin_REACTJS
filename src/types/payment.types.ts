// Payment and Revenue Analytics Types

// ==================== PAYMENT DASHBOARD TYPES ====================

export interface PaymentDashboardResponse {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalSubscriptions: number;
    activeUsers: number;
    conversionRate: number;
    averageOrderValue: number;
    lastUpdated: string;
  };
  realtime: {
    onlineUsers: number;
    todaySignups: number;
    todayRevenue: number;
    todayTransactions: number;
    activeTrials: number;
    systemStatus: "HEALTHY" | "WARNING" | "ERROR";
  };
  kpis: Array<{
    name: string;
    value: string;
    unit: string;
    changePercentage: number;
    changeDirection: "UP" | "DOWN" | "STABLE";
    status: "GOOD" | "WARNING" | "CRITICAL";
    description: string;
  }>;
  chartData: {
    revenueChart: Array<{
      date: string;
      value: number;
      label: string;
    }>;
    planDistribution: Array<{
      label: string;
      value: number;
      percentage: number;
      color: string;
    }>;
    subscriptionGrowth: Array<{
      date: string;
      value: number;
      label: string;
    }>;
    monthlyComparison: Array<{
      category: string;
      current: number;
      previous: number;
      growth: number;
    }>;
  };
  alerts: Array<{
    id: string;
    type: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: "SUBSCRIPTION" | "PAYMENT" | "CANCELLATION" | "UPGRADE";
    description: string;
    userEmail: string;
    amount?: number;
    timestamp: string;
    status: string;
  }>;
}

// ==================== REVENUE STATISTICS TYPES ====================

export interface RevenueStatisticsResponse {
  period: {
    startDate: string;
    endDate: string;
    days: number;
    periodType: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  };
  summary: {
    totalRevenue: number;
    averageRevenuePerUser: number;
    monthlyRecurringRevenue: number;
    yearlyRecurringRevenue: number;
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    successRate: number;
    activeSubscriptions: number;
    newSubscriptions: number;
    canceledSubscriptions: number;
  };
  planBreakdown: Record<string, {
    planType: string;
    revenue: number;
    subscriptionCount: number;
    averageRevenue: number;
    marketShare: number;
    newSubscriptions: number;
    renewalCount: number;
    cancellationCount: number;
    churnRate: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    transactionCount: number;
    newSubscriptions: number;
    activeSubscriptions: number;
    growthRate: number;
  }>;
  topPayingUsers: Array<{
    userId: number;
    userEmail: string;
    userFullName: string;
    totalRevenue: number;
    transactionCount: number;
    currentPlan: string;
    firstPayment: string;
    lastPayment: string;
    loyaltyScore: number;
  }>;
  trends: {
    weekOverWeekGrowth: number;
    monthOverMonthGrowth: number;
    yearOverYearGrowth: number;
    trendDirection: "UP" | "DOWN" | "STABLE";
    insights: string[];
    predictedNextMonthRevenue: number;
  };
}

export interface RevenueStatisticsQueryParams {
  startDate?: string;
  endDate?: string;
  periodType?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  includeTrends?: boolean;
}

// ==================== SUBSCRIPTION ANALYTICS TYPES ====================

export interface SubscriptionAnalyticsResponse {
  period: {
    startDate: string;
    endDate: string;
    days: number;
    periodType: string;
  };
  overview: {
    totalActiveSubscriptions: number;
    totalCanceledSubscriptions: number;
    newSubscriptionsThisPeriod: number;
    renewalsThisPeriod: number;
    overallChurnRate: number;
    retentionRate: number;
    averageLifetimeValue: number;
    subscriptionsByStatus: Record<string, number>;
  };
  planPerformance: Array<{
    planType: string;
    planName: string;
    planPrice: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    newSubscriptions: number;
    cancellations: number;
    renewals: number;
    marketShare: number;
    conversionRate: number;
    churnRate: number;
    retentionRate: number;
    totalRevenue: number;
    averageRevenuePerUser: number;
    growthRate: number;
    trendDirection: "GROWING" | "DECLINING" | "STABLE";
    popularityRank: "MOST_POPULAR" | "SECOND" | "LEAST_POPULAR";
    satisfactionScore: number;
    topFeatures: string[];
  }>;
  premiumUsers: {
    totalPremiumUsers: number;
    newPremiumUsers: number;
    premiumUserPercentage: number;
    topPremiumUsers: Array<{
      userId: number;
      userEmail: string;
      userFullName: string;
      currentPlan: string;
      totalSpent: number;
      subscriptionStartDate: string;
      subscriptionDurationMonths: number;
      engagementScore: number;
      favoriteFeatures: string[];
      riskLevel: "LOW" | "MEDIUM" | "HIGH";
    }>;
    premiumUsersByPlan: Record<string, number>;
    averagePremiumLifetime: number;
    averagePremiumSpending: number;
    premiumUsersByCountry: Record<string, number>;
    averageDailyActiveUsers: number;
    averageFeatureUsage: number;
    mostUsedPremiumFeatures: string[];
  };
  churnAnalysis: {
    overallChurnRate: number;
    churnRateByPlan: Record<string, number>;
    topChurnReasons: Array<{
      reason: string;
      count: number;
      percentage: number;
    }>;
    usersAtRisk: number;
    highRiskUserIds: number[];
    averageTimeToChurn: number;
    churnByUserSegment: Record<string, number>;
  };
  upgradePatterns: Array<{
    fromPlan: string;
    toPlan: string;
    upgradeCount: number;
    downgradeCount: number;
    conversionRate: number;
    revenueImpact: number;
    averageTimeToUpgrade: number;
    upgradeReasons: string[];
  }>;
}

export interface SubscriptionAnalyticsQueryParams {
  days?: number;
  includeChurn?: boolean;
  includePremiumUsers?: boolean;
}

// ==================== REVENUE TRENDS TYPES ====================

export interface RevenueTrendsResponse {
  trends: Array<{
    date: string;
    revenue: number;
    transactions: number;
    forecast?: number;
  }>;
  forecast?: Array<{
    date: string;
    predictedRevenue: number;
    confidence: number;
  }>;
  summary: {
    totalPeriodRevenue: number;
    averageDailyRevenue: number;
    growthRate: number;
    trendDirection: "UP" | "DOWN" | "STABLE";
  };
}

export interface RevenueTrendsQueryParams {
  days?: number;
  includeForecast?: boolean;
}

// ==================== PREMIUM USERS TYPES ====================

export interface PremiumUser {
  userId: number;
  userEmail: string;
  userFullName: string;
  currentPlan: string;
  totalSpent: number;
  subscriptionStartDate: string;
  subscriptionDurationMonths: number;
  engagementScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  lastActivity: string;
  planFeatures: string[];
}

export interface PremiumUsersResponse {
  content: PremiumUser[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PremiumUsersQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  planType?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

// ==================== PACKAGE PERFORMANCE TYPES ====================

export interface PackagePerformance {
  planType: string;
  planName: string;
  planPrice: number;
  totalRevenue: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  cancellations: number;
  conversionRate: number;
  churnRate: number;
  marketShare: number;
  growthRate: number;
  trendDirection: "GROWING" | "DECLINING" | "STABLE";
  averageRevenuePerUser: number;
  customerSatisfaction: number;
}

export interface PackagePerformanceQueryParams {
  days?: number;
  sortBy?: string;
}

// ==================== CHURN ANALYSIS TYPES ====================

export interface ChurnAnalysisResponse {
  overview: {
    overallChurnRate: number;
    monthlyChurnRate: number;
    churnRateChange: number;
    usersAtRisk: number;
    averageTimeToChurn: number;
  };
  churnReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  churnByPlan: Record<string, {
    planName: string;
    churnRate: number;
    churnCount: number;
    retentionRate: number;
  }>;
  riskUsers: Array<{
    userId: number;
    userEmail: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    riskFactors: string[];
    predictedChurnDate: string;
    currentPlan: string;
    totalSpent: number;
  }>;
  churnTrends: Array<{
    date: string;
    churnCount: number;
    churnRate: number;
  }>;
}

export interface ChurnAnalysisQueryParams {
  days?: number;
}

// ==================== DASHBOARD SUMMARY TYPES ====================

export interface AnalyticsSummary {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalSubscriptions: number;
    activeUsers: number;
    conversionRate: number;
    averageOrderValue: number;
  };
  kpis: Array<{
    name: string;
    value: string;
    unit: string;
    changePercentage: number;
    changeDirection: "UP" | "DOWN" | "STABLE";
    status: "GOOD" | "WARNING" | "CRITICAL";
  }>;
}

// ==================== EXPORT TYPES ====================

export interface ExportParams {
  startDate: string;
  endDate: string;
  format?: 'CSV' | 'EXCEL' | 'PDF';
}

export interface UserExportParams {
  format?: 'CSV' | 'EXCEL' | 'PDF';
  period?: string;
  startDate?: string;
  endDate?: string;
}