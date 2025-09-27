import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

export default function AuthSuccess() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const [countdown, setCountdown] = useState(3)
  const [hasProcessed, setHasProcessed] = useState(false)

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) return

    const handleAuthSuccess = async () => {
      setHasProcessed(true)
      
      try {
        // GỌI checkAuth để set authentication state trước khi redirect
        await checkAuth()
        
        // Show success message
        toast({
          title: 'Đăng nhập thành công!',
          description: 'Chào mừng bạn đến với hệ thống quản lý.',
        })

      } catch (error) {
        toast({
          title: 'Có lỗi xảy ra',
          description: 'Không thể xác thực người dùng. Đang chuyển về trang đăng nhập.',
          variant: 'destructive',
        })

        // Redirect to login on error
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
        return
      }

      // Start countdown sau khi checkAuth thành công
      setTimeout(() => {
        let countdownValue = 3
        const countdownInterval = setInterval(() => {
          countdownValue--
          setCountdown(countdownValue)
          
          if (countdownValue <= 0) {
            clearInterval(countdownInterval)
            navigate('/dashboard', { replace: true })
          }
        }, 1000)
      }, 500)
    }

    handleAuthSuccess()
  }, [hasProcessed, checkAuth, navigate])

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
            {/* Success Icon */}
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

            {/* Success Message */}
            <div className='space-y-2'>
              <h1 className='text-2xl font-semibold tracking-tight text-green-600'>
                Đăng nhập thành công!
              </h1>
              <p className='text-muted-foreground'>
                Bạn đã đăng nhập thành công qua Google OAuth. <br />
                Đang chuyển hướng đến trang quản lý...
              </p>
            </div>

            {/* Loading Spinner */}
            <div className='flex items-center space-x-2'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
              <span className='text-sm text-muted-foreground'>
                Đang tải dữ liệu người dùng...
              </span>
            </div>

            {/* Countdown */}
            <div className='text-sm text-muted-foreground'>
              Tự động chuyển hướng trong{' '}
              <span className='font-semibold text-blue-600'>{countdown}</span> giây
            </div>

            {/* Manual redirect button */}
            <button
              onClick={() => navigate('/dashboard', { replace: true })}
              className='mt-4 text-blue-600 hover:text-blue-800 underline text-sm'
            >
              Hoặc click vào đây để vào ngay
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
