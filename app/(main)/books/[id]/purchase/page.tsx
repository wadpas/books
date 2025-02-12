import { db } from '@/db/db'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CheckoutForm } from './_components/CheckoutForm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await db.book.findUnique({ where: { id } })
  if (book === null) return notFound()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: book.price * 100,
    currency: 'UAH',
    metadata: { bookId: book.id },
  })

  if (paymentIntent.client_secret == null) {
    throw Error('Stripe failed to create payment intent')
  }
  return (
    <CheckoutForm
      book={book}
      clientSecret={paymentIntent.client_secret}
    />
  )
}
