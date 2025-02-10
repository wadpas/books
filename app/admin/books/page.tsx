import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageHeader } from '../_components/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/db/db'
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_components/BookActions'

export default function AdminBooksPage() {
  return (
    <>
      <div className='flex justify-between items-center gap-4'>
        <PageHeader>Книги</PageHeader>
        <Button asChild>
          <Link href='/admin/books/new'>Додати книгу</Link>
        </Button>
      </div>
      <ProductTable />
    </>
  )
}

async function ProductTable() {
  const books = await db.book.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      isAvailable: true,
      _count: { select: { orders: true } },
    },
    orderBy: { title: 'asc' },
  })

  if (books.length === 0) return <div className='text-muted-foreground text-center mt-4'>Книги відсутні</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>Наявність</TableHead>
          <TableHead>Книга</TableHead>
          <TableHead>Ціна</TableHead>
          <TableHead>Замовлення</TableHead>
          <TableHead className='w-0'>Дії</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell>
              {book.isAvailable ? (
                <>
                  <CheckCircle2 />
                </>
              ) : (
                <XCircle className='text-red-500' />
              )}
            </TableCell>
            <TableCell>{book.title}</TableCell>
            <TableCell>{formatCurrency(book.price)}</TableCell>
            <TableCell>{formatNumber(book._count.orders) + ' шт.'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/books/${book.id}/download`}>Завантажити</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/books/${book.id}/edit`}>Редагувати</Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem
                    id={book.id}
                    isAvailable={book.isAvailable}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={book.id}
                    disabled={book._count.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
