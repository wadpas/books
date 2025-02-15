import { Button } from '@/components/ui/button'
import { PageHeader } from '../_components/PageHeader'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, Globe, Infinity, Minus, MoreVertical, XCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { db } from '@/db/db'
import { Prisma } from '@prisma/client'
import { formatDateTime, formatDiscount, formatNumber } from '@/lib/formatters'
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_components/DiscountActions'

const WHERE_EXPIRED: Prisma.DiscountWhereInput = {
  OR: [{ limit: { not: null, lte: db.discount.fields.uses } }, { expiresAt: { not: undefined, lte: new Date() } }],
}

const SELECT_FIELDS: Prisma.DiscountSelect = {
  id: true,
  allBooks: true,
  code: true,
  discountAmount: true,
  discountType: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  books: { select: { title: true } },
  _count: { select: { orders: true } },
}

function getExpiredDiscounts() {
  return db.discount.findMany({
    select: SELECT_FIELDS,
    where: WHERE_EXPIRED,
    orderBy: { createdAt: 'asc' },
  })
}

function getUnexpiredDiscounts() {
  return db.discount.findMany({
    select: SELECT_FIELDS,
    where: { NOT: WHERE_EXPIRED },
    orderBy: { createdAt: 'asc' },
  })
}

export default async function DiscountsPage() {
  const [expiredDiscounts, unexpiredDiscounts] = await Promise.all([getExpiredDiscounts(), getUnexpiredDiscounts()])

  return (
    <>
      <div className='flex justify-between items-center gap-4'>
        <PageHeader>Акції</PageHeader>
        <Button asChild>
          <Link href='/admin/discounts/new'>Додати акцію</Link>
        </Button>
      </div>
      <DiscountsTable
        discounts={unexpiredDiscounts}
        canDeactivate
      />

      <div className='mt-8'>
        <h2 className='text-xl font-bold'>Завершені акції</h2>
        <DiscountsTable
          discounts={expiredDiscounts}
          isInactive
        />
      </div>
    </>
  )
}

type DiscountsTableProps = {
  discounts: Awaited<ReturnType<typeof getUnexpiredDiscounts>>
  isInactive?: boolean
  canDeactivate?: boolean
}

function DiscountsTable({ discounts, isInactive = false, canDeactivate = false }: DiscountsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Активні</span>
          </TableHead>
          <TableHead>Назва</TableHead>
          <TableHead>Значення</TableHead>
          <TableHead>Дата завершення</TableHead>
          <TableHead>Залишок</TableHead>
          <TableHead>Використано</TableHead>
          <TableHead>Книги</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discounts.map((discount) => (
          <TableRow key={discount.id}>
            <TableCell>
              {discount.isActive && !isInactive ? (
                <>
                  <span className='sr-only'>Активна</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className='sr-only'>Неактивна</span>
                  <XCircle className='stroke-destructive' />
                </>
              )}
            </TableCell>
            <TableCell>{discount.code}</TableCell>
            <TableCell>{formatDiscount(discount)}</TableCell>
            <TableCell>{discount.expiresAt == null ? <Minus /> : formatDateTime(discount.expiresAt)}</TableCell>
            <TableCell>
              {discount.limit == null ? <Infinity /> : formatNumber(discount.limit - discount.uses)}
            </TableCell>
            <TableCell>{formatNumber(discount._count.orders)}</TableCell>
            <TableCell>{discount.allBooks ? <Globe /> : discount.books.map((p) => p.title).join(', ')}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Дії</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {canDeactivate && (
                    <>
                      <ActiveToggleDropdownItem
                        id={discount.id}
                        isActive={discount.isActive}
                      />
                    </>
                  )}
                  <DeleteDropdownItem
                    id={discount.id}
                    disabled={discount._count.orders > 0}
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
