// Bulk action types - khớp chính xác với backend response

// ==================== BULK ACTION TYPES ====================

// Bulk action response - từ POST /api/admin/users/bulk-action
export interface BulkActionResponse {
  successful: number[]; // List of user IDs that were processed successfully
  failed: number[]; // List of user IDs that failed to process
  totalProcessed: number;
  timestamp: string; // DateTime
}

// Bulk action types
export type BulkActionType = 'activate' | 'deactivate' | 'suspend' | 'assign_role' | 'remove_role';

// Bulk action request payload
export interface BulkActionRequest {
  userIds: number[];
  action: string;
  status?: string; // For status changes
  roleId?: number; // For role assignments
  reason?: string; // Optional reason for the action
}
