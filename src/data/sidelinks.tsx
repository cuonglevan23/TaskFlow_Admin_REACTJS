import { IconBrandProducthunt, IconLayoutDashboard, IconMessages, IconShoppingCart, IconFileText, IconChartBar, IconRobot } from "@tabler/icons-react"
import { User2Icon } from "lucide-react"


export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Posts',
    label: '',
    href: '/dashboard/posts',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'Email',
    label: '',
    href: '/dashboard/emails',
    icon: <IconShoppingCart size={18} />,
    sub: [
      {
        title: 'Email',
        label: '',
        href: '/dashboard/emails',
        icon: <IconBrandProducthunt size={18} />,
      },
      
      
    ],
  },
  
  {
    title: 'Users',
    label: '',
    href: '/dashboard/users',
    icon: <User2Icon size={18} />,
  },
  {
    title: 'Analytics',
    label: '',
    href: '/dashboard/analytics',
    icon: <IconChartBar size={18} />,
  },
  {
    title: 'Audit Logs',
    label: '',
    href: '/dashboard/audit-logs',
    icon: <IconFileText size={18} />,
  },
  {
    title: 'AI Agent',
    label: '',
    href: '/dashboard/ai-agent',
    icon: <IconRobot size={18} />,
  },
]
