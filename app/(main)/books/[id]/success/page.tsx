import { Button } from '@/components/ui/button'
import { db } from '@/db/db'
import { formatCurrency } from '@/lib/formatters'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ payment_intent: string }> }) {
  const { payment_intent } = await searchParams

  const paymentIntentRetrieve = await stripe.paymentIntents.retrieve(payment_intent)
  if (paymentIntentRetrieve.metadata.bookId == null) return notFound()

  const book = await db.book.findUnique({
    where: { id: paymentIntentRetrieve.metadata.bookId },
  })
  if (book == null) return notFound()

  const isSuccess = paymentIntentRetrieve.status === 'succeeded'

  return (
    <div className='w-full max-w-5xl mx-auto space-y-8'>
      <h1 className='text-4xl font-bold'>{isSuccess ? 'Success!' : 'Error!'}</h1>
      <div className='flex items-center gap-4'>
        <div className='relative flex-shrink-0 w-1/3 aspect-video'>
          <Image
            src={book.coverPath}
            fill
            alt='Book cover'
          />
        </div>
        <div>
          <h1 className='text-2xl font-bold'>{book.title}</h1>
          <div className='line-clamp-3 text-muted-foreground'>{book.description}</div>
          <Button
            className='mt-4'
            size='lg'
            asChild>
            {isSuccess ? (
              <a href={`/books/download/${await createDownloadVerification(book.id)}`}>Download</a>
            ) : (
              <Link href={`/books/${book.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

async function createDownloadVerification(bookId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        bookId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id
}
