import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/db/db'
import { formatCurrency } from '@/lib/formatters'
import { PageHeader } from '../_components/PageHeader'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Minus, MoreVertical } from 'lucide-react'
import { DeleteDropDownItem } from './_components/OrderActions'

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      totalPrice: true,
      book: { select: { title: true } },
      user: { select: { email: true } },
      discount: { select: { code: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <OrdersTable />
    </>
  )
}

async function OrdersTable() {
  const orders = await getOrders()

  if (orders.length === 0) return <p>No sales found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Книга</TableHead>
          <TableHead>Покупець</TableHead>
          <TableHead>Сума</TableHead>
          <TableHead>Акція</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.book.title}</TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>{formatCurrency(order.totalPrice / 100)}</TableCell>
            <TableCell>{order.discount == null ? <Minus /> : order.discount.code}</TableCell>
            <TableCell className='text-center'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={order.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
