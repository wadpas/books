import Navbar, { NavLink } from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar>
        <NavLink href='/'>Головна</NavLink>
        <NavLink href='/books'>Книги</NavLink>
        <NavLink href='/orders'>Замовлення</NavLink>
      </Navbar>
      <div className='container flex-1 p-6 mx-auto bg-zinc-50'>{children}</div>
    </div>
  )
}
