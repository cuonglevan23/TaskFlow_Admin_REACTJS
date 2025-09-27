import { useAuth } from '@/contexts/auth-context'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'

interface GoogleAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GoogleAuthForm({ className, ...props }: GoogleAuthFormProps) {
  const { loginWithGoogle, loading, error, clearError } = useAuth()

  const handleGoogleLogin = () => {
    // Clear any previous errors
    if (error) {
      clearError()
    }

    // Initiate Google OAuth login
    loginWithGoogle()
  }

  return (
    <div className={cn('grid gap-4 mt-6', className)} {...props}>
      <Button
        variant='outline'
        type='button'
        disabled={loading}
        onClick={handleGoogleLogin}
        className='w-full'
      >
        {loading ? (
          <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
        ) : (
          <IconBrandGoogle className='mr-2 h-4 w-4' />
        )}
        Đăng nhập với Google
      </Button>

      {error && (
        <div className='text-center text-sm text-red-600 bg-red-50 p-2 rounded-md'>
          {error}
        </div>
      )}

      <div className='mt-4 text-center'>
        <p className='text-xs text-muted-foreground'>
          Hệ thống chỉ hỗ trợ đăng nhập qua Google OAuth. <br />
          Không cần tạo tài khoản riêng.
        </p>
      </div>
    </div>
  )
}
