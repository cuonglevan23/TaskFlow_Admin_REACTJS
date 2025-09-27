// API functions for audit logs management - Updated to match backend endpoints
import api from './axios.customize';
import {
  AuditLogResponseDto,
  AuditLogQueryParams
} from '@/types/audit.types';

// Get all audit logs with pagination and filtering
export const getAuditLogs = async (params?: AuditLogQueryParams): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);
  
  if (params?.userId !== undefined) queryParams.append('userId', params.userId.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.entityType) queryParams.append('entityType', params.entityType);
  if (params?.entityId) queryParams.append('entityId', params.entityId);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.days !== undefined) queryParams.append('days', params.days.toString());
  if (params?.ipAddress) queryParams.append('ipAddress', params.ipAddress);
  if (params?.suspiciousOnly !== undefined) queryParams.append('suspiciousOnly', params.suspiciousOnly.toString());
  if (params?.action) queryParams.append('action', params.action);
  if (params?.success !== undefined) queryParams.append('success', params.success.toString());
  if (params?.severity) queryParams.append('severity', params.severity);

  const queryString = queryParams.toString();
  const url = queryString ? `/admin/audit-logs?${queryString}` : '/admin/audit-logs';
  
  const result = await api.get(url);
  return result;
};

// Get audit log by ID
export const getAuditLogById = async (id: number): Promise<AuditLogResponseDto> => {
  return api.get(`/admin/audit-logs/${id}`);
};

// Get suspicious activities report
export const getSuspiciousActivities = async (hours: number = 24, threshold: number = 50): Promise<any> => {
  const queryParams = new URLSearchParams();
  queryParams.append('hours', hours.toString());
  queryParams.append('threshold', threshold.toString());
  
  const url = `/admin/audit-logs/suspicious?${queryParams.toString()}`;
  
  const result = await api.get(url);
  return result;
};

// Get audit statistics
export const getAuditStatistics = async (days: number = 30): Promise<any> => {
  const queryParams = new URLSearchParams();
  queryParams.append('days', days.toString());
  
  const url = `/admin/audit-logs/statistics?${queryParams.toString()}`;
  
  const result = await api.get(url);
  return result;
};

// Get recent activities
export const getRecentActivities = async (limit: number = 10): Promise<any> => {
  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());
  
  return api.get(`/admin/audit-logs/recent?${queryParams.toString()}`);
};

// Export audit logs
export const exportAuditLogs = async (request: any): Promise<any> => {
  return api.post('/admin/audit-logs/export', request);
};

// Helper function to get severity color
export const getSeverityColor = (severity: string): string => {
  const severityMap: Record<string, string> = {
    'LOW': 'text-green-600 bg-green-50',
    'MEDIUM': 'text-yellow-600 bg-yellow-50',
    'HIGH': 'text-orange-600 bg-orange-50',
    'CRITICAL': 'text-red-600 bg-red-50'
  };
  return severityMap[severity] || 'text-gray-600 bg-gray-50';
};

// Helper function to format user display name
export const formatUserDisplayName = (audit: AuditLogResponseDto): string => {
  if (audit.userFullName) return audit.userFullName;
  if (audit.userEmail) return audit.userEmail;
  if (audit.userId) return `User #${audit.userId}`;
  return 'System';
};

// Helper function to format audit action
export const formatAuditAction = (action: string): string => {
  return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to get action color
export const getActionColor = (action: string): string => {
  const actionColorMap: Record<string, string> = {
    'CREATE': 'text-green-600 bg-green-50 border-green-200',
    'UPDATE': 'text-blue-600 bg-blue-50 border-blue-200',
    'DELETE': 'text-red-600 bg-red-50 border-red-200',
    'LOGIN': 'text-purple-600 bg-purple-50 border-purple-200',
    'LOGOUT': 'text-gray-600 bg-gray-50 border-gray-200',
    'ACCESS': 'text-cyan-600 bg-cyan-50 border-cyan-200'
  };
  return actionColorMap[action] || 'text-gray-600 bg-gray-50 border-gray-200';
};

// Helper function to get success color
export const getSuccessColor = (success: boolean): string => {
  return success 
    ? 'text-green-600 bg-green-50 border-green-200'
    : 'text-red-600 bg-red-50 border-red-200';
};

// Helper function to get suspicious color
export const getSuspiciousColor = (suspicious: boolean, riskScore?: number): string => {
  if (!suspicious) return 'text-green-600 bg-green-50 border-green-200';
  if (riskScore && riskScore > 80) return 'text-red-600 bg-red-50 border-red-200';
  if (riskScore && riskScore > 60) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-yellow-600 bg-yellow-50 border-yellow-200';
};
