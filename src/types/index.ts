// Export all types
export * from './user.types';
export * from './statistics.types';
export * from './activity.types';
export * from './bulk.types';
export * from './payment.types';
export * from './email.types';
export * from './ai-agent.types';
export * from './audit.types';
export * from './analytics.types';

// ==================== COMMON TYPES ====================

// API Response wrapper (từ axios.customize.ts)
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Common error response
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
