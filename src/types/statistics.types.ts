// Statistics types - khớp chính xác với backend response

// ==================== STATISTICS TYPES ====================

// User distribution object
export interface UserDistribution {
  active: number;
  inactive: number;
  suspended: number;
  online: number;
}

// System statistics response - từ GET /api/admin/statistics
export interface SystemStatisticsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  monthlyGrowthRate: number; // Double
  lastUpdated: string; // DateTime
  userDistribution: UserDistribution;
}
