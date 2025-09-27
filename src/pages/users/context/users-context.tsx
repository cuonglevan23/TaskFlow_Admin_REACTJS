import React, { useState, useEffect } from 'react'
import { AdminUserResponseDto, UsersPageResponse, UserQueryParams } from '@/types'
import { getUsers } from '@/api/userApi'
import useDialogState from '@/hooks/use-dialog-state'

type UsersDialogType = 'edit' | 'status' | 'role' | 'view'

interface UsersContextType {
  // Dialog state
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: AdminUserResponseDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AdminUserResponseDto | null>>

  // Data state
  users: AdminUserResponseDto[]
  loading: boolean
  error: string | null

  // Pagination
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
  }

  // Filters
  filters: UserQueryParams
  setFilters: (filters: UserQueryParams) => void

  // Actions
  refreshUsers: () => Promise<void>
  setPage: (page: number) => void
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AdminUserResponseDto | null>(null)

  // Data state
  const [users, setUsers] = useState<AdminUserResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  })

  // Filters state
  const [filters, setFilters] = useState<UserQueryParams>({
    page: 0,
    size: 10,
    search: '',
    status: undefined,
    sortBy: 'createdAt',
    sortDir: 'desc'
  })

  // Fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response: UsersPageResponse = await getUsers(filters)

      // Transform user data for compatibility with current frontend
      const transformedUsers = response.content.map(user => ({
        ...user,
        // Computed fields cho backward compatibility
        name: user.displayName || user.fullName || `${user.firstName} ${user.lastName}`,
        isOnline: user.online || user.isOnline || false,
        lastLogin: user.lastLoginAt,
        // Keep roleNames as is, don't override roles to avoid type conflict
      })) as AdminUserResponseDto[]

      setUsers(transformedUsers)

      // Handle pagination structure from Spring Boot
      setPagination({
        page: response.pageable?.pageNumber || response.number || 0,
        size: response.pageable?.pageSize || response.size || 10,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last
      })
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Unable to load user list')
    } finally {
      setLoading(false)
    }
  }

  // Refresh users
  const refreshUsers = async () => {
    await fetchUsers()
  }

  // Set page
  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page: page - 1 })) // Convert to 0-based for backend
  }

  // Update filters
  const updateFilters = (newFilters: UserQueryParams) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 0 })) // Reset to first page when filters change
  }

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers()
  }, [filters])

  return (
    <UsersContext.Provider value={{
      open,
      setOpen,
      currentRow,
      setCurrentRow,
      users,
      loading,
      error,
      pagination,
      filters,
      setFilters: updateFilters,
      refreshUsers,
      setPage
    }}>
      {children}
    </UsersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
