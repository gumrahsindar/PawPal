'use client'

import Link from 'next/link'
import Logo from './logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Dashboard',
    path: '/app/dashboard',
  },
  {
    label: 'Account',
    path: '/app/account',
  },
]

export default function AppHeader() {
  const activePathName = usePathname()

  return (
    <header className='flex justify-between items-center border-b border-white/10 py-2'>
      <Logo />

      <nav>
        <ul className='flex gap-2'>
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  'text-white/70  rounded-md px-2 py-1 hover:text-white focus:text-white duration-200',
                  {
                    'bg-black/10 text-white': activePathName === route.path,
                  }
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
