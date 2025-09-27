import { useState } from 'react'
import { AdminUserResponseDto, UpdateUserStatusRequest, UserStatus } from '@/types'
import { updateUserStatus } from '@/api/userApi'
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
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'

interface UsersStatusDialogProps {
  open: boolean
  onOpenChange: () => void
  user: AdminUserResponseDto
}

export function UsersStatusDialog({ open, onOpenChange, user }: UsersStatusDialogProps) {
  const { refreshUsers } = useUsers()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateUserStatusRequest>({
    status: user.status,
    reason: ''
  })

  const statusOptions: { value: UserStatus; label: string; description: string; color: string }[] = [
    {
      value: 'ACTIVE',
      label: 'Active',
      description: 'User can access the system normally',
      color: 'text-green-600'
    },
    {
      value: 'INACTIVE',
      label: 'Inactive',
      description: 'Temporarily disable access rights',
      color: 'text-gray-600'
    },
    {
      value: 'SUSPENDED',
      label: 'Suspended',
      description: 'Lock account permanently or temporarily',
      color: 'text-red-600'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await updateUserStatus(user.id, formData)

      toast({
        title: 'Success',
        description: `User status has been changed from "${user.status}" to "${response.status}".`,
      })

      await refreshUsers()
      onOpenChange()
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: 'Error',
        description: 'Unable to update user status.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const isStatusChanged = formData.status !== user.status

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>
          <DialogDescription>
            Change the activity status of <strong>{user.name}</strong> ({user.email})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Select new status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value: UserStatus) =>
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className={`font-medium ${option.color}`}>
                      {option.label}
                      {option.value === user.status && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {isStatusChanged && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Change</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for status change (optional)"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
          )}

          {isStatusChanged && formData.status === 'SUSPENDED' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Warning: Account Suspension
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Suspending the account will prevent the user from accessing the system.
                      Please make sure you want to perform this action.
                    </p>
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !isStatusChanged}
              variant={formData.status === 'SUSPENDED' ? 'destructive' : 'default'}
            >
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
