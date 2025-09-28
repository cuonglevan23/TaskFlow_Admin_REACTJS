import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth, RedirectIfAuthenticated } from './components/auth-guard'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const router = createBrowserRouter([
  // Root redirect - nếu authenticated thì đi dashboard, không thì đi login
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Auth routes (không cần authentication)
  {
    path: '/login',
    element: <RedirectIfAuthenticated />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/auth/sign-in-2')).default,
        }),
      },
    ],
  },

  // Auth success page (sau khi Google OAuth thành công) - NO AUTH GUARD
  {
    path: '/auth/success',
    lazy: async () => ({
      Component: (await import('./pages/auth/success')).default,
    }),
  },

  // Protected admin routes (cần authentication)
  {
    path: '/dashboard',
    element: <RequireAuth />,
    errorElement: <GeneralError />,
    children: [
      {
        path: '',
        lazy: async () => {
          const AppShell = await import('./components/app-shell')
          return { Component: AppShell.default }
        },
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/dashboard')).default,
            }),
          },
        
      
          {
            path: 'analytics',
            lazy: async () => ({
              Component: (await import('@/pages/analytics')).default,
            }),
          },
       
          {
            path: 'emails',
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import('@/pages/email/list')).default,
                }),
              }
            ],
          },

          {
            path: 'supports',
            lazy: async () => ({
              Component: (await import('@/pages/support')).default,
            }),
          },
          {
            path: 'users',
            lazy: async () => ({
              Component: (await import('@/pages/users')).default,
            }),
          },
          {
            path: 'audit-logs',
            lazy: async () => ({
              Component: (await import('@/pages/audit-logs')).default,
            }),
          },
          {
            path: 'ai-agent',
            lazy: async () => ({
              Component: (await import('@/pages/ai-agent')).default,
            }),
          },
          {
            path: 'posts',
            lazy: async () => ({
              Component: (await import('@/pages/posts')).default,
            }),
          },

        ],
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Catch all - redirect to login
  { path: '*', element: <Navigate to="/login" replace /> },
])

export default router
