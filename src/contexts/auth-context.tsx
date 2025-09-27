import React, { createContext, useContext, useState } from 'react';
import {
  initiateGoogleLogin,
  logoutUser,
  checkAuthStatus,
  getCurrentUser,
  handleAuthError,
  type UserInfo
} from '@/api/authApi';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  // Auth state
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;

  // Auth actions
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false); // Bắt đầu với false, chỉ loading khi cần thiết
  const [error, setError] = useState<string | null>(null);

  // Không auto-check auth khi mount - chỉ check khi cần thiết
  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // Check authentication status manually (chỉ gọi khi cần thiết)
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const isAuth = await checkAuthStatus();
      
      if (isAuth) {
        try {
          const userData = await getCurrentUser();
          
          if (userData && (userData.email || userData.name)) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(true);
            setUser(null);
          }
        } catch (userError) {
          console.warn('Failed to get user data:', userError);
          setIsAuthenticated(true);
          setUser(null);
        }
      } else {
        // User is not authenticated
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err: any) {
      console.warn('Auth check failed:', err);
      // Always set to not authenticated if check fails
      setIsAuthenticated(false);
      setUser(null);
      setError(null); // Don't show error for auth check failures
    } finally {
      // Always set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  // Google OAuth login function
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      // Call API to get Google OAuth URL and redirect
      await initiateGoogleLogin();

    } catch (err: any) {
      console.error('Google login failed:', err);
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      setLoading(false);

      toast({
        title: 'Đăng nhập thất bại',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);

      await logoutUser();

      // Clear state
      setIsAuthenticated(false);
      setUser(null);

      toast({
        title: 'Đăng xuất thành công',
        description: 'Bạn đã đăng xuất khỏi hệ thống.',
      });
    } catch (err: any) {
      console.error('Logout failed:', err);
      const errorMessage = handleAuthError(err);
      setError(errorMessage);

      // Even if logout API fails, clear local state and redirect
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    checkAuth,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
