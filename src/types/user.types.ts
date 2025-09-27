// User types - cập nhật để khớp với backend responses thực tế

// ==================== ENUMS ====================
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type UserRole = 'ADMIN' | 'MEMBER';
export type OnlineStatus = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY';
export type RegistrationSource = 'GOOGLE_OAUTH' | 'EMAIL' | 'FACEBOOK' | 'GITHUB';
export type PremiumPlanType = 'BASIC' | 'PRO' | 'ENTERPRISE';

// ==================== ROLE TYPES ====================
export interface RoleDto {
  id: number;
  name: string;
  description: string;
}

// ==================== BASE USER TYPES ====================

// AdminUserResponseDto - từ GET /api/admin/users (cấu trúc thực tế từ backend)
export interface AdminUserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  status: UserStatus;
  firstLogin: boolean;
  deleted: boolean;
  online: boolean;
  isEmailVerified: boolean;
  isPremium: boolean;
  isUpgraded: boolean;
  premiumPlanType: PremiumPlanType | null;
  premiumExpiry: string | null; // DateTime
  createdAt: string; // DateTime
  updatedAt: string; // DateTime
  lastLoginAt: string | null; // DateTime
  lastSeenAt: string | null; // DateTime
  department: string | null;
  jobTitle: string | null;
  aboutMe: string | null;
  roles: RoleDto[] | null;
  roleNames: string[];
  organizationName: string | null;
  totalTeams: number;
  totalProjects: number;
  totalTasks: number;
  isOnline: boolean;
  onlineStatus: OnlineStatus | null;
  registrationSource: RegistrationSource | null;
  statusReason: string | null;
  statusChangedAt: string | null; // DateTime

  // Computed fields for backward compatibility
  name?: string; // Will be computed from firstName + lastName
  displayName?: string; // Alternative display name
  fullName?: string; // Full name combination
  emailVerified?: boolean; // Map from isEmailVerified
  premium?: boolean; // Map from isPremium
  upgraded?: boolean; // Map from isUpgraded
  statusChangedBy?: string | null;
}

// UserResponseDto - từ PUT /api/admin/users/{userId}
export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  roles: string[];
  updatedAt: string; // DateTime
}

// UserStatusDto - từ PATCH /api/admin/users/{userId}/status
export interface UserStatusDto {
  userId: number;
  status: string;
  previousStatus: string;
  reason: string;
  updatedAt: string; // DateTime
}

// ==================== PAGINATION TYPES ====================

// Pageable structure from Spring Boot
export interface Pageable {
  sort: {
    sorted: boolean;
    unsorted: boolean;
  };
  pageNumber: number;
  pageSize: number;
}

// Page<AdminUserResponseDto> - từ GET /api/admin/users (cấu trúc Spring Boot thực tế)
export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  // Legacy fields for backward compatibility
  size?: number;
  number?: number;
}

export type UsersPageResponse = PageResponse<AdminUserResponseDto>;

// ==================== USER DETAILS TYPES ====================

// Team data từ user details
export interface TeamDto {
  id: number;
  name: string;
  description: string;
  memberCount: number;
}

// Project data từ user details
export interface ProjectDto {
  id: number;
  name: string;
  description: string;
  status: string;
}

// User details response - từ GET /api/admin/users/{userId}
export interface UserDetailsResponse {
  user: AdminUserResponseDto;
  teams: TeamDto[];
  projects: ProjectDto[];
  totalTeams: number;
  totalProjects: number;
}

// ==================== ROLE MANAGEMENT TYPES ====================

// Role assignment/removal response
export interface RoleActionResponse {
  message: string;
  userId: string;
  roleId: string;
}

// ==================== REQUEST PAYLOADS ====================

// Update user payload
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  department?: string;
  jobTitle?: string;
  aboutMe?: string;
}

// Update status payload
export interface UpdateUserStatusRequest {
  status: UserStatus;
  reason?: string;
}

// ==================== QUERY PARAMS ====================

export interface UserQueryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: UserStatus;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
