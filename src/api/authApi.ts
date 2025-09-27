// Auth API functions - khớp với backend AuthController
import api from './axios.customize';

// ==================== TYPES ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface GoogleAuthResponse {
  authUrl: string;
  state: string;
  scopes?: string[] | null;
}

export interface AuthError {
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  roles: string[];
  isOnline: boolean;
  lastLogin?: string;
}

// ==================== AUTH API FUNCTIONS ====================

/**
 * Login with email and password
 * POST /auth/login
 */
export const loginWithEmail = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return api.post('/auth/login', credentials);
};

/**
 * Initiate Google OAuth login for admin
 * GET /auth/google/url?client_type=admin - Get Google OAuth URL and redirect
 */
export const initiateGoogleLogin = async (): Promise<void> => {
  try {
    const response: GoogleAuthResponse = await api.get('/auth/google/url?client_type=admin');

    // Redirect to Google OAuth URL
    if (response.authUrl) {
      window.location.href = response.authUrl;
    } else {
      throw new Error('No auth URL received from server');
    }
  } catch (error) {
    // Failed to get Google OAuth URL
    throw error;
  }
};

/**
 * Refresh access token using HTTP-only refresh token cookie
 * POST /auth/refresh
 */
export const refreshToken = async (): Promise<void> => {
  // Backend sẽ tự động lấy refresh token từ HTTP-only cookie
  // và set new cookies với new tokens
  return api.post('/auth/refresh');
};

/**
 * Logout user and clear HTTP-only cookies
 * POST /auth/logout
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Backend sẽ:
    // 1. Revoke refresh token
    // 2. Clear accessToken và refreshToken cookies
    // 3. Update user online status
    await api.post('/auth/logout');
  } catch (error) {
    // Logout error handled silently
  } finally {
    // Redirect về login page
    window.location.href = '/login';
  }
};

/**
 * Check authentication status by verifying HTTP-only cookies
 * GET /api/user-profiles/me
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    await api.get('user-profiles/me');
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get current user information
 * GET /api/user-profiles/me
 */
export const getCurrentUser = async (): Promise<UserInfo> => {
  const response = await api.get('user-profiles/me');
  return response.data || response;
};

/**
 * Handle authentication errors
 */
export const handleAuthError = (error: any): string => {
  if (error.response?.data) {
    const authError = error.response.data as AuthError;

    // Handle validation errors (400)
    if (authError.details && authError.details.length > 0) {
      return authError.details.map(d => `${d.field}: ${d.message}`).join(', ');
    }

    // Handle other errors (401, 403, 500)
    return authError.message || authError.error || 'Có lỗi xảy ra';
  }

  return 'Không thể kết nối với server';
};
