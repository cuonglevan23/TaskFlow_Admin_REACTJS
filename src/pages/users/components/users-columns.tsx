import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AdminUserResponseDto, UserStatus } from '@/types'
import { getUserStatusColor, getRoleBadgeColor, formatUserLastLogin } from '@/api/userApi'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import LongText from '@/components/long-text'

export const columns: ColumnDef<AdminUserResponseDto>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
				className='translate-y-[2px]'
			/>
		),
		meta: {
			className: cn(
				'sticky md:table-cell left-0 z-10 rounded-tl',
				'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
			),
		},
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
				className='translate-y-[2px]'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' />
		),
		cell: ({ row }) => (
			<div className='max-w-20'>#{row.getValue('id')}</div>
		),
		meta: {
			className: cn(
				'sticky left-[52px] z-10 md:table-cell',
				'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
			),
		},
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='User Name' />
		),
		cell: ({ row }) => {
			// Use displayName or fullName from backend, fallback to firstName + lastName
			const user = row.original;
			const displayName = user.displayName || user.fullName || `${user.firstName} ${user.lastName}`;

			return (
				<div className='flex items-center space-x-2'>
					<div className='font-medium'>{displayName}</div>
					{(user.online || user.isOnline) && (
						<div className='w-2 h-2 bg-green-500 rounded-full' title='Online' />
					)}
				</div>
			)
		},
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => (
			<LongText className='max-w-48'>{row.getValue('email')}</LongText>
		),
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => {
			const status = row.getValue('status') as UserStatus
			return (
				<Badge variant='outline' className={getUserStatusColor(status)}>
					{status === 'ACTIVE' ? 'Active' :
					status === 'INACTIVE' ? 'Inactive' :
					'Suspended'}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'roleNames',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Roles' />
		),
		cell: ({ row }) => {
			const user = row.original;
			const roleNames = user.roleNames || [];

			return (
				<div className='flex gap-1'>
					{roleNames.length > 0 ? (
						roleNames.map((role, index) => (
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
			)
		},
	},
	{
		accessorKey: 'lastLoginAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Last Login' />
		),
		cell: ({ row }) => {
			const lastLoginAt = row.original.lastLoginAt;
			return (
				<div className='text-sm text-muted-foreground'>
					{formatUserLastLogin(lastLoginAt)}
				</div>
			)
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Ngày tạo' />
		),
		cell: ({ row }) => {
			const createdAt = row.getValue('createdAt') as string
			const date = new Date(createdAt)
			return (
				<div className='text-sm text-muted-foreground'>
					{date.toLocaleDateString('vi-VN', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
					})}
				</div>
			)
		},
	},
	{
		id: 'actions',
		header: () => <div className='text-center'>Thao tác</div>,
		cell: ({ row }) => <DataTableRowActions row={row} />,
		meta: {
			className: cn(
				'sticky right-0 z-10 rounded-tr',
				'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
			),
		},
	},
]
