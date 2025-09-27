import { IconLogout } from '@tabler/icons-react'
import { Button } from './custom/button'
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip'
import { logoutUser } from '@/api/authApi'
import { useState } from 'react'

interface LogoutButtonProps {
  isCollapsed: boolean
  closeNav: () => void
}

export default function LogoutButton({ isCollapsed, closeNav }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      closeNav() // Close mobile nav if open
      await logoutUser() // This will call the API and redirect to login
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoading(false)
    }
  }

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <IconLogout size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          Logout
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <IconLogout size={18} className="mr-2" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}