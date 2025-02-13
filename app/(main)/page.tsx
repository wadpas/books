import { BookCard, BookCardSkeleton } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { db } from '@/db/db'
import { cache } from '@/lib/cache'
import { Book } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const getPopularBooks = cache(
  () => {
    return db.book.findMany({
      orderBy: { orders: { _count: 'desc' } },
      where: { isAvailable: true },
      take: 6,
    })
  },
  ['/', 'getPopularBooks'],
  { revalidate: 60 * 60 * 24 }
)

const getNewBooks = cache(
  () => {
    return db.book.findMany({
      orderBy: { createdAt: 'desc' },
      where: { isAvailable: true },
      take: 6,
    })
  },
  ['/', 'getNewBooks'],
  { revalidate: 60 * 60 * 24 }
)

export default function HomePage() {
  return (
    <main className='space-y-12'>
      <BookGridSection
        title='Popular Books'
        bookFetcher={getPopularBooks}
      />
      <BookGridSection
        title='New Books'
        bookFetcher={getNewBooks}
      />
    </main>
  )
}

type BookGridSectionProps = {
  title: string
  bookFetcher: () => Promise<Book[]>
}

function BookGridSection({ bookFetcher, title }: BookGridSectionProps) {
  return (
    <div className='space-y-4'>
      <div className='flex gap-4'>
        <h2 className='text-3xl font-bold'>{title}</h2>
        <Button
          variant='outline'
          asChild>
          <Link
            href='/books'
            className='space-x-2'>
            <span>View All</span>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Suspense
          fallback={
            <>
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
            </>
          }>
          <BookSuspense bookFetcher={bookFetcher} />
        </Suspense>
      </div>
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
