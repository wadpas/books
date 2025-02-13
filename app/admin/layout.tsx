import Navbar, { NavLink } from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar>
        <NavLink href='/admin'>Головна</NavLink>
        <NavLink href='/admin/books'>Книги</NavLink>
        <NavLink href='/admin/users'>Користувачі</NavLink>
        <NavLink href='/admin/orders'>Замовлення</NavLink>
      </Navbar>
      <div className='container flex-1 p-6 mx-auto bg-zinc-50'>{children}</div>
    </div>
  )
}
