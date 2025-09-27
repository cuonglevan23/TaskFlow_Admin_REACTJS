import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AdminUserResponseDto } from '@/types'
import { formatUserLastLogin, getUserStatusColor, getRoleBadgeColor } from '@/lib/helper'

interface UsersViewDialogProps {
  user: AdminUserResponseDto
  open: boolean
  onOpenChange: () => void
}

export function UsersViewDialog({ user, open, onOpenChange }: UsersViewDialogProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h4>
      {children}
    </div>
  )

  const InfoItem = ({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) => (
    <div className="flex justify-between items-start py-2">
      <span className="text-sm text-muted-foreground font-medium min-w-0 flex-shrink-0 w-32">{label}:</span>
      <span className={`text-sm font-medium text-right flex-1 min-w-0 ${className}`}>{value}</span>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={user.avatarUrl ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatarUrl}` : undefined} 
                alt={user.displayName || user.fullName} 
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user.displayName || user.fullName || user.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.displayName || user.fullName || `${user.firstName} ${user.lastName}`}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Complete user information and system data (read-only view)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Personal Information */}
          <InfoSection title="Personal Information">
            <div className="grid grid-cols-1 gap-1">
              <InfoItem label="Display Name" value={user.displayName || user.fullName || `${user.firstName} ${user.lastName}` || 'N/A'} />
              <InfoItem label="Full Name" value={user.fullName || `${user.firstName} ${user.lastName}` || 'N/A'} />
              <InfoItem label="First Name" value={user.firstName || 'N/A'} />
              <InfoItem label="Last Name" value={user.lastName || 'N/A'} />
              <InfoItem label="Email" value={user.email} />
              <InfoItem 
                label="Email Verified" 
                value={
                  <Badge variant={user.isEmailVerified ? 'default' : 'secondary'}>
                    {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                } 
              />
              <InfoItem label="About Me" value={user.aboutMe || 'N/A'} />
            </div>
          </InfoSection>

          <Separator />

          {/* Professional Information */}
          <InfoSection title="Professional Information">
            <div className="grid grid-cols-1 gap-1">
              <InfoItem label="Job Title" value={user.jobTitle || 'N/A'} />
              <InfoItem label="Department" value={user.department || 'N/A'} />
              <InfoItem label="Organization" value={user.organizationName || 'N/A'} />
            </div>
          </InfoSection>

          <Separator />

          {/* Account Status */}
          <InfoSection title="Account Status">
            <div className="grid grid-cols-1 gap-1">
              <InfoItem 
                label="Status" 
                value={
                  <Badge variant='outline' className={getUserStatusColor(user.status)}>
                    {user.status === 'ACTIVE' ? 'Active' :
                     user.status === 'INACTIVE' ? 'Inactive' :
                     'Suspended'}
                  </Badge>
                } 
              />
              <InfoItem 
                label="Online Status" 
                value={
                  <div className="flex items-center space-x-2">
                    {(user.online || user.isOnline) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                    <span>{user.onlineStatus || 'OFFLINE'}</span>
                  </div>
                } 
              />
              <InfoItem 
                label="Roles" 
                value={
                  <div className="flex gap-1 flex-wrap justify-end">
                    {user.roleNames && user.roleNames.length > 0 ? (
                      user.roleNames.map((role, index) => (
                        <Badge key={index} variant='outline' className={getRoleBadgeColor(role)}>
                          {role === 'ADMIN' ? 'Admin' : 'Member'}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant='outline' className='text-gray-500'>
                        No roles assigned
                      </Badge>
                    )}
                  </div>
                } 
              />
              <InfoItem label="Status Reason" value={user.statusReason || 'N/A'} />
              <InfoItem label="Status Changed At" value={formatDate(user.statusChangedAt)} />
              <InfoItem label="Status Changed By" value={user.statusChangedBy || 'N/A'} />
            </div>
          </InfoSection>

          <Separator />

          {/* Premium & Subscription */}
          <InfoSection title="Premium & Subscription">
            <div className="grid grid-cols-1 gap-1">
              <InfoItem 
                label="Premium" 
                value={
                  <Badge variant={user.isPremium ? 'default' : 'secondary'}>
                    {user.isPremium ? 'Premium User' : 'Free User'}
                  </Badge>
                } 
              />
              <InfoItem label="Premium Plan" value={user.premiumPlanType || 'N/A'} />
              <InfoItem label="Premium Expiry" value={formatDate(user.premiumExpiry)} />
              <InfoItem 
                label="Upgraded" 
                value={
                  <Badge variant={user.isUpgraded ? 'default' : 'secondary'}>
                    {user.isUpgraded ? 'Yes' : 'No'}
                  </Badge>
                } 
              />
            </div>
          </InfoSection>

          <Separator />

          {/* Activity & Statistics */}
          <InfoSection title="Activity & Statistics">
            <div className="grid grid-cols-1 gap-1">
              <InfoItem label="Total Projects" value={user.totalProjects || 0} />
              <InfoItem label="Total Teams" value={user.totalTeams || 0} />
              <InfoItem label="Total Tasks" value={user.totalTasks || 0} />
              <InfoItem label="Last Login" value={formatUserLastLogin(user.lastLoginAt)} />
              <InfoItem label="Last Seen" value={formatDate(user.lastSeenAt)} />
              <InfoItem 
                label="First Login" 
                value={
                  <Badge variant={user.firstLogin ? 'default' : 'secondary'}>
                    {user.firstLogin ? 'Completed' : 'Not Yet'}
                  </Badge>
                } 
              />
            </div>
          </InfoSection>

          <Separator />

          {/* System Information */}
          <InfoSection title="System Information">
            <div className="grid grid-cols-1 gap-1">
              <InfoItem label="User ID" value={user.id} />
              <InfoItem label="Registration Source" value={user.registrationSource || 'N/A'} />
              <InfoItem label="Created At" value={formatDate(user.createdAt)} />
              <InfoItem label="Updated At" value={formatDate(user.updatedAt)} />
              <InfoItem 
                label="Deleted" 
                value={
                  <Badge variant={user.deleted ? 'destructive' : 'default'}>
                    {user.deleted ? 'Yes' : 'No'}
                  </Badge>
                } 
              />
            </div>
          </InfoSection>
        </div>
      </DialogContent>
    </Dialog>
  )
}