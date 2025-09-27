import { useState } from 'react'
import { AdminUserResponseDto, UserRole } from '@/types'
import { assignUserRole, removeUserRole } from '@/api/userApi'
import { useUsers } from '../context/users-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface UsersRoleDialogProps {
  open: boolean
  onOpenChange: () => void
  user: AdminUserResponseDto
}

const ROLE_OPTIONS = [
  {
    value: 'ADMIN' as UserRole,
    label: 'Quản trị viên',
    description: 'Có thể quản lý toàn bộ hệ thống và người dùng',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    value: 'MEMBER' as UserRole,
    label: 'Thành viên',
    description: 'Quyền truy cập cơ bản vào hệ thống',
    color: 'bg-blue-100 text-blue-800'
  }
]

export function UsersRoleDialog({ open, onOpenChange, user }: UsersRoleDialogProps) {
  const { refreshUsers } = useUsers()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>((user.roles as any) || [])

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev.filter(r => r !== (role as any)), role])
    } else {
      setSelectedRoles(prev => prev.filter(r => r !== (role as any)))
    }
  }

  const getRoleChanges = () => {
    const currentRoles = (user.roles as any) || []
    const rolesToAdd = selectedRoles.filter(role => !currentRoles.includes(role as any))
    const rolesToRemove = currentRoles.filter((role: any) => !selectedRoles.includes(role as any))

    return { rolesToAdd, rolesToRemove }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { rolesToAdd, rolesToRemove } = getRoleChanges()

      // Note: Backend expects roleId, but we only have role names
      // This is a simplified implementation - you may need to fetch role IDs first
      const promises = []

      // Add new roles
      for (const role of rolesToAdd) {
        // Assuming roleId mapping: ADMIN = 1, MEMBER = 2
        const roleId = role === 'ADMIN' ? 1 : 2
        promises.push(assignUserRole(user.id, roleId))
      }

      // Remove old roles
      for (const role of rolesToRemove) {
        const roleId = role === 'ADMIN' ? 1 : 2
        promises.push(removeUserRole(user.id, roleId))
      }

      await Promise.all(promises)

      toast({
        title: 'Thành công',
        description: 'Quyền của người dùng đã được cập nhật.',
      })

      await refreshUsers()
      onOpenChange()
    } catch (error) {
      console.error('Error updating user roles:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật quyền người dùng.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = () => {
    const { rolesToAdd, rolesToRemove } = getRoleChanges()
    return rolesToAdd.length > 0 || rolesToRemove.length > 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quản lý quyền người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật quyền truy cập cho <strong>{user.name}</strong> ({user.email})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Quyền hiện tại</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.roles && user.roles.length > 0 ? (
                  (user.roles as any).map((role: any) => {
                    const roleOption = ROLE_OPTIONS.find(r => r.value === role)
                    return (
                      <Badge key={String(role)} className={roleOption?.color}>
                        {roleOption?.label || String(role)}
                      </Badge>
                    )
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">Chưa có quyền nào</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Chọn quyền mới</Label>
              {ROLE_OPTIONS.map((roleOption) => (
                <div key={roleOption.value} className="flex items-start space-x-3">
                  <Checkbox
                    id={roleOption.value}
                    checked={selectedRoles.includes(roleOption.value)}
                    onCheckedChange={(checked) =>
                      handleRoleChange(roleOption.value, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={roleOption.value} className="font-medium cursor-pointer">
                      {roleOption.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {roleOption.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hasChanges() && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400">ℹ️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Thay đổi sẽ được áp dụng
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    {(() => {
                      const { rolesToAdd, rolesToRemove } = getRoleChanges()
                      const changes = []

                      if (rolesToAdd.length > 0) {
                        changes.push(`Thêm: ${rolesToAdd.map(r => 
                          ROLE_OPTIONS.find(o => o.value === r)?.label || r
                        ).join(', ')}`)
                      }

                      if (rolesToRemove.length > 0) {
                        changes.push(`Xóa: ${rolesToRemove.map((r: any) => 
                          ROLE_OPTIONS.find(o => o.value === r)?.label || r
                        ).join(', ')}`)
                      }

                      return changes.join(' | ')
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onOpenChange}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !hasChanges()}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật quyền'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
