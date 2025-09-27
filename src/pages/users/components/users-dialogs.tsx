import { useUsers } from '../context/users-context'
import { UsersEditDialog } from './users-edit-dialog'
import { UsersStatusDialog } from './users-status-dialog'
import { UsersRoleDialog } from './users-role-dialog'
import { UsersViewDialog } from './users-view-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()

  const handleCloseDialog = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }

  return (
    <>
      {currentRow && (
        <>
          <UsersViewDialog
            key={`user-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={handleCloseDialog}
            user={currentRow}
          />

          <UsersEditDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={handleCloseDialog}
            user={currentRow}
          />

          <UsersStatusDialog
            key={`user-status-${currentRow.id}`}
            open={open === 'status'}
            onOpenChange={handleCloseDialog}
            user={currentRow}
          />

          <UsersRoleDialog
            key={`user-role-${currentRow.id}`}
            open={open === 'role'}
            onOpenChange={handleCloseDialog}
            user={currentRow}
          />
        </>
      )}
    </>
  )
}
