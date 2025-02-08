'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'
import Image from 'next/image'

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <nav className='justify-center bg-primary text-primary-foreground'>
      <div className='container flex mx-auto'>
        <Image
          className='items-center mx-5'
          src='./logo.svg'
          width={40}
          height={40}
          alt='logo'
        />
        {children}
      </div>
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname()
  return (
    <Link
      {...props}
      className={cn(
        'p-3 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathname === props.href && 'bg-background text-foreground'
      )}
    />
  )
}
