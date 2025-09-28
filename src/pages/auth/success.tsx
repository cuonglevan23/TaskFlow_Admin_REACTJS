import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

export default function AuthSuccess() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const [countdown, setCountdown] = useState(5)
  const [hasProcessed, setHasProcessed] = useState(false)
  const [authStatus, setAuthStatus] = useState<'checking' | 'success' | 'error'>('checking')

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) return

    const handleAuthSuccess = async () => {
      setHasProcessed(true)
      
      try {
        // Wait a bit for cookies to be properly set by browser
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Try checkAuth multiple times in case of timing issues
        let authSuccess = false
        let attempts = 0
        const maxAttempts = 5

        while (!authSuccess && attempts < maxAttempts) {
          attempts++
          console.log(`🔒 Auth check attempt ${attempts}/${maxAttempts}`)

          try {
            await checkAuth()
            authSuccess = true
            console.log('✅ Authentication check successful')
          } catch (error) {
            console.log(`❌ Auth check attempt ${attempts} failed:`, error)
            if (attempts < maxAttempts) {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
        }

        if (!authSuccess) {
          throw new Error('Failed to verify authentication after multiple attempts')
        }

        setAuthStatus('success')

        // Show success message
        toast({
          title: 'Đăng nhập thành công!',
          description: 'Chào mừng bạn đến với hệ thống quản lý.',
        })

        // Start countdown after successful auth
        let countdownValue = 5
        const countdownInterval = setInterval(() => {
          countdownValue--
          setCountdown(countdownValue)
          
          if (countdownValue <= 0) {
            clearInterval(countdownInterval)
            navigate('/dashboard', { replace: true })
          }
        }, 1000)

      } catch (error) {
        console.error('❌ OAuth success handling failed:', error)
        setAuthStatus('error')

        toast({
          title: 'Có lỗi xảy ra',
          description: 'Không thể xác thực người dùng. Đang chuyển về trang đăng nhập.',
          variant: 'destructive',
        })

        // Redirect to login on error after delay
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    }

    handleAuthSuccess()
  }, [hasProcessed, checkAuth, navigate])

  const getStatusMessage = () => {
    switch (authStatus) {
      case 'checking':
        return 'Đang xác thực thông tin đăng nhập...'
      case 'success':
        return `Đăng nhập thành công! Chuyển hướng trong ${countdown} giây...`
      case 'error':
        return 'Có lỗi xảy ra. Đang chuyển về trang đăng nhập...'
    }
  }

  const getStatusIcon = () => {
    switch (authStatus) {
      case 'checking':
        return (
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )
      case 'success':
        return (
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <svg
              className='h-8 w-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
            <svg
              className='h-8 w-8 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          <h1 className='text-xl font-medium'>Admin Dashboard</h1>
        </div>

        <Card className='p-6'>
          <div className='flex flex-col items-center space-y-4 text-center'>
            {getStatusIcon()}

            <div className='space-y-2'>
              <h2 className='text-xl font-semibold'>
                {authStatus === 'checking' && 'Xác thực đăng nhập'}
                {authStatus === 'success' && 'Đăng nhập thành công!'}
                {authStatus === 'error' && 'Có lỗi xảy ra'}
              </h2>
              <p className='text-muted-foreground'>
                {getStatusMessage()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
