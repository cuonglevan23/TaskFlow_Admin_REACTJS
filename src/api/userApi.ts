// API functions cho quản lý users (Google OAuth Flow)
import api from './axios.customize';
import type { 
  UsersPageResponse,
  UserDetailsResponse,
  UserResponseDto,
  UserStatusDto,
  RoleActionResponse,
  SystemStatisticsResponse,
  UserActivityResponse,
  BulkActionResponse,
  UserQueryParams,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  BulkActionRequest
} from '../types';

// ==================== USER API FUNCTIONS ====================

/**
 * Get list of users with pagination and filters
 */
export const getUsers = async (params?: UserQueryParams): Promise<UsersPageResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

  const queryString = queryParams.toString();
  const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
  
  return api.get(url);
};

/**
 * Get user details with teams and projects
 */
export const getUserDetails = async (userId: number): Promise<UserDetailsResponse> => {
  return api.get(`/admin/users/${userId}`);
};

/**
 * Update user information (chỉ admin có thể cập nhật name)
 */
export const updateUser = async (userId: number, userData: UpdateUserRequest): Promise<UserResponseDto> => {
  return api.put(`/admin/users/${userId}`, userData);
};

/**
 * Update user status (activate/deactivate/suspend)
 */
export const updateUserStatus = async (userId: number, statusData: UpdateUserStatusRequest): Promise<UserStatusDto> => {
  return api.patch(`/admin/users/${userId}/status`, statusData);
};

/**
 * Assign role to user (ADMIN hoặc MEMBER)
 */
export const assignUserRole = async (userId: number, roleId: number): Promise<RoleActionResponse> => {
  return api.post(`/admin/users/${userId}/roles/${roleId}`);
};

/**
 * Remove role from user
 */
export const removeUserRole = async (userId: number, roleId: number): Promise<RoleActionResponse> => {
  return api.delete(`/admin/users/${userId}/roles/${roleId}`);
};

/**
 * Get system statistics
 */
export const getSystemStatistics = async (): Promise<SystemStatisticsResponse> => {
  return api.get('/admin/statistics');
};

/**
 * Get user activity report
 */
export const getUserActivityReport = async (userId: number): Promise<UserActivityResponse> => {
  return api.get(`/admin/users/${userId}/activity`);
};

/**
 * Perform bulk actions on multiple users
 */
export const bulkUserAction = async (bulkData: BulkActionRequest): Promise<BulkActionResponse> => {
  return api.post('/admin/users/bulk-action', bulkData);
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get user display name từ AdminUserResponseDto (cấu trúc mới)
 */
export const getUserDisplayName = (user: {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  displayName?: string;
  fullName?: string;
}): string => {
  // Ưu tiên displayName hoặc fullName nếu có
  if (user.displayName) return user.displayName;
  if (user.fullName) return user.fullName;

  // Tạo từ firstName + lastName
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  // Fallback về name nếu có
  if (user.name) return user.name;

  // Cuối cùng dùng email
  return user.email;
};

/**
 * Get user status badge color
 */
export const getUserStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800';
    case 'SUSPENDED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get role badge color
 */
export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800';
    case 'MEMBER':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Check if user is active
 */
export const isUserActive = (status: string): boolean => {
  return status === 'ACTIVE';
};

/**
 * Check if user is admin từ roleNames array
 */
export const isUserAdmin = (roleNames: string[]): boolean => {
  return roleNames.includes('ADMIN');
};

/**
 * Format user last login (sử dụng lastLoginAt từ backend)
 */
export const formatUserLastLogin = (lastLoginAt?: string | null): string => {
  if (!lastLoginAt) return 'Chưa đăng nhập';

  const date = new Date(lastLoginAt);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Vừa mới đăng nhập';
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Get user roles from roleNames array
 */
export const getUserRoles = (roleNames: string[]): string[] => {
  return roleNames || [];
};

/**
 * Get user online status
 */
export const getUserOnlineStatus = (user: {
  online: boolean;
  isOnline: boolean;
  onlineStatus?: string | null
}): { isOnline: boolean; status: string } => {
  const isOnline = user.online || user.isOnline;
  const status = user.onlineStatus || (isOnline ? 'ONLINE' : 'OFFLINE');

  return { isOnline, status };
};

/**
 * Transform backend user data để compatibility với frontend
 */
export const transformUserData = (user: any): any => {
  return {
    ...user,
    // Computed fields cho backward compatibility
    name: getUserDisplayName(user),
    displayName: user.displayName || user.fullName || getUserDisplayName(user),
    isOnline: user.online || user.isOnline || false,
    lastLogin: user.lastLoginAt, // Map cho compatibility
    roles: user.roleNames || [], // Use roleNames instead of roles object
  };
};

/**
 * Convert frontend pagination to backend pagination (Spring Boot style)
 */
export const convertPagination = (page: number, limit: number) => {
  return {
    page: page, // Spring Boot pagination có thể bắt đầu từ 0 hoặc 1
    size: limit
  };
};

/**
 * Convert backend pagination to frontend pagination
 */
export const convertBackendPagination = (backendPagination: any) => {
  return {
    page: backendPagination.pageable?.pageNumber || backendPagination.number || 0,
    size: backendPagination.pageable?.pageSize || backendPagination.size || 10,
    totalElements: backendPagination.totalElements || 0,
    totalPages: backendPagination.totalPages || 0,
    first: backendPagination.first || false,
    last: backendPagination.last || false,
  };
};

// ==================== CONSTANTS ====================

export const USER_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động', color: 'green' },
  { value: 'INACTIVE', label: 'Không hoạt động', color: 'gray' },
  { value: 'SUSPENDED', label: 'Bị khóa', color: 'red' },
] as const;

export const USER_ROLES = [
  { value: 'ADMIN', label: 'Quản trị viên', color: 'purple' },
  { value: 'MEMBER', label: 'Thành viên', color: 'blue' },
] as const;

export const BULK_ACTION_OPTIONS = [
  { value: 'activate', label: 'Kích hoạt', icon: '✅', status: 'ACTIVE' },
  { value: 'deactivate', label: 'Vô hiệu hóa', icon: '⏸️', status: 'INACTIVE' },
  { value: 'suspend', label: 'Khóa tài khoản', icon: '🚫', status: 'SUSPENDED' },
] as const;

export const USER_SORT_OPTIONS = [
  { value: 'createdAt', label: 'Ngày tạo' },
  { value: 'lastLogin', label: 'Lần đăng nhập cuối' },
  { value: 'name', label: 'Tên' },
  { value: 'email', label: 'Email' },
  { value: 'status', label: 'Trạng thái' },
] as const;

// ==================== HTTP STATUS CODES ====================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
