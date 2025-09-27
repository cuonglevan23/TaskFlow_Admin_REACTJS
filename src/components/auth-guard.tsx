import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'

// Component để check authentication
export function RequireAuth() {
  const { isAuthenticated, loading, checkAuth } = useAuth()

  // Auto-check auth khi component mount (chỉ cho protected routes)
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading, checkAuth]);

  if (loading) {
    // Show loading spinner while checking auth
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2">Đang xác thực...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Not authenticated, redirecting to login
    return <Navigate to="/login" replace />
  }

  // Authenticated, rendering outlet
  return <Outlet />
}

// Component để redirect authenticated users từ login page
export function RedirectIfAuthenticated() {
  const { isAuthenticated, loading, error } = useAuth()

  console.log('🔒 RedirectIfAuthenticated check:', { isAuthenticated, loading, error });

  if (loading) {
    console.log('🔒 RedirectIfAuthenticated: Still loading, showing spinner');
    // Show loading spinner while checking auth
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2">Kiểm tra trạng thái đăng nhập...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    console.log('🔒 RedirectIfAuthenticated: Already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />
  }

  console.log('🔒 RedirectIfAuthenticated: Not authenticated, showing login page');
  return <Outlet />
}
