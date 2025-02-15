import { db } from '@/db/db'
import { PageHeader } from '../../_components/PageHeader'
import { DiscountForm } from '../_components/DiscountForm'

export default async function NewDiscountCodePage() {
  const books = await db.book.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })

  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <DiscountForm books={books} />
    </>
  )
}
