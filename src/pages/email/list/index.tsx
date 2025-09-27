import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { EmailProvider } from '../context/email-context'
import SimpleEmailInterface from '../components/SimpleEmailInterface.tsx'

export default function EmailMarketing() {
  return (
    <EmailProvider>
      <Layout>
        <Layout.Header sticky>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>
        <Layout.Body>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <SimpleEmailInterface />
          </div>
        </Layout.Body>
      </Layout>
    </EmailProvider>
  )
}
