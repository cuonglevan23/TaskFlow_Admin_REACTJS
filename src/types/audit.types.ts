// Audit Log Types - Updated to match backend response structure

// ==================== CORE AUDIT LOG INTERFACE ====================

export interface AuditLogResponseDto {
  id: number;
  userId: number | null;
  userEmail: string | null;
  userFullName: string | null;
  action: string;
  
  // Enhanced audit tracking fields
  entityType: string;    // "USER", "PROJECT", "TEAM", "TASK"
  entityId: string;      // ID của entity bị tác động
  ipAddress: string;     // IP address của user
  userAgent: string;     // Browser/device info
  sessionId: string;     // Session identifier
  details: string;       // Chi tiết thêm (JSON format)
  severity: string;      // "LOW", "MEDIUM", "HIGH", "CRITICAL"
  success: boolean;      // Action có thành công không
  
  createdAt: string;     // ISO datetime string
}

// ==================== PAGINATED RESPONSE ====================

export interface PaginatedAuditLogsResponse {
  content: AuditLogResponseDto[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

// ==================== SUSPICIOUS ACTIVITIES ====================

export interface SuspiciousUser {
  userId: number;
  userEmail: string;
  actionCount: number;
  actionsPerHour: number;
  topActions: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SuspiciousActivitiesResponse {
  suspiciousUsers: SuspiciousUser[];
  timeRange: {
    startTime: string;
    endTime: string;
    hours: number;
  };
  threshold: number;
  summary: {
    totalSuspiciousUsers: number;
    totalActionsAnalyzed: number;
    highRiskUsers: number;
  };
}

// ==================== AUDIT STATISTICS ====================

export interface AuditStatisticsResponse {
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalActions: number;
    uniqueUsers: number;
    successfulActions: number;
    failedActions: number;
    successRate: number;
  };
  actionBreakdown: Record<string, number>;
  severityBreakdown: Record<string, number>;
  userActivity: Array<{
    userId: number;
    userEmail: string;
    actionCount: number;
  }>;
  timelineData: Array<{
    date: string;
    actionCount: number;
  }>;
  topActions: Array<{
    action: string;
    count: number;
    percentage: number;
  }>;
}

// ==================== QUERY PARAMETERS ====================

export interface AuditLogQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  
  // User filtering
  userId?: number;
  search?: string;
  
  // Entity filtering
  entityType?: string;
  entityId?: string;
  
  // Time filtering
  startDate?: string;
  endDate?: string;
  days?: number;
  
  // Security filtering
  ipAddress?: string;
  suspiciousOnly?: boolean;
  
  // Action filtering
  action?: string;
  success?: boolean;
  severity?: string;
}

// ==================== EXPORT FUNCTIONALITY ====================

export interface ExportAuditLogsRequest {
  format: 'CSV' | 'EXCEL' | 'PDF';
  filters?: AuditLogQueryParams;
  includeDetails?: boolean;
}

export interface ExportAuditLogsResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}

// ==================== RECENT ACTIVITIES ====================

export type RecentActivitiesResponse = AuditLogResponseDto[];

// ==================== HELPER TYPES ====================

export interface ParsedAuditDetails {
  [key: string]: any;
}

// ==================== LEGACY ALIASES ====================

export type AuditLogDto = AuditLogResponseDto;
export type AuditLogsPageResponse = PaginatedAuditLogsResponse;
export type AuditLogStatistics = AuditStatisticsResponse;