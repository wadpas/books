import { BookCard, BookCardSkeleton } from '@/components/ProductCard'
import { db } from '@/db/db'
import { cache } from '@/lib/cache'
import React, { Suspense } from 'react'
import { Book } from '@prisma/client'

const getBooks = cache(
  () => {
    return db.book.findMany({
      where: { isAvailable: true },
    })
  },
  ['/books', 'getBooks'],
  { revalidate: 60 * 60 * 24 }
)

export default function BookPage() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Suspense
        fallback={
          <>
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
          </>
        }>
        <BookSuspense bookFetcher={getBooks} />
      </Suspense>
    </div>
  )
}

async function BookSuspense({ bookFetcher }: { bookFetcher: () => Promise<Book[]> }) {
  return (await bookFetcher()).map((book) => (
    <BookCard
      key={book.id}
      {...book}
    />
  ))
}
