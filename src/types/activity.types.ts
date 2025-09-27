// Activity types - khớp chính xác với backend response

// ==================== ACTIVITY TYPES ====================

// Activity item
export interface ActivityItem {
  type: string;
  timestamp: string; // DateTime
  details: any; // Object - có thể chứa bất kỳ dữ liệu nào
}

// Activity statistics
export interface ActivityStatistics {
  totalActions: number;
  lastActive: string; // DateTime
}

// User activity report response - từ GET /api/admin/users/{userId}/activity
export interface UserActivityResponse {
  userId: number;
  activityPeriod: number;
  activities: ActivityItem[];
  statistics: ActivityStatistics;
}
