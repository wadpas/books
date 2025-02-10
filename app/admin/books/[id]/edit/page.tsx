import { db } from '@/db/db'
import { PageHeader } from '../../../_components/PageHeader'
import BookForm from '../../_components/BookForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await db.book.findUnique({
    where: { id },
  })
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <BookForm book={book} />
    </>
  )
}
