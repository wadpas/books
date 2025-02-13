import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { totalPrice: true },
    _count: true,
  })

  return {
    totalAmount: data._sum.totalPrice || 0,
    totalOrders: data._count,
  }
}

async function getUsersData() {
  const [usersCount, ordersSum] = await Promise.all([
    db.user.count(),
    db.order.aggregate({ _sum: { totalPrice: true } }),
  ])
  return {
    usersCount,
    orderPerUser: usersCount === 0 ? 0 : ordersSum._sum.totalPrice || 0 / usersCount,
  }
}

async function getBooksData() {
  const [activeBooks, allBooks] = await Promise.all([db.book.count({ where: { isAvailable: true } }), db.book.count()])
  return {
    activeBooks,
    allBooks,
  }
}

export default async function AdminDashboard() {
  const [salesData, usersData, booksData] = await Promise.all([getSalesData(), getUsersData(), getBooksData()])

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <DashboardCard
        title='Замовлення'
        description={`${formatNumber(salesData.totalOrders)} замовлень`}
        content={`Сума: ${formatCurrency(salesData.totalAmount / 100)}`}
      />
      <DashboardCard
        title='Користувачі'
        description={`${formatNumber(usersData.usersCount)} активних`}
        content={`Медіана: ${formatCurrency(usersData.orderPerUser / 100)}`}
      />
      <DashboardCard
        title='Книги'
        description={`${formatNumber(booksData.activeBooks)} активних`}
        content={`Всього: ${formatNumber(booksData.allBooks)} шт.`}
      />
    </div>
  )
}

type DashboardCardProps = {
  title: string
  description: string
  content: string
}

function DashboardCard({ title, description, content }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
