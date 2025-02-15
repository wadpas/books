import { db } from '@/db/db'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CheckoutForm } from './_components/CheckoutForm'
import { usableDiscountWhere } from '@/lib/discountHelpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ coupon?: string }>
}) {
  const { id } = await params
  const { coupon } = await searchParams
  const book = await db.book.findUnique({ where: { id } })
  if (book === null) return notFound()

  const discount = coupon == null ? undefined : await getDiscount(coupon, book.id)

  return (
    <CheckoutForm
      book={book}
      discount={discount || undefined}
    />
  )
}

function getDiscount(coupon: string, bookId: string) {
  return db.discount.findUnique({
    select: { id: true, discountAmount: true, discountType: true },
    where: { ...usableDiscountWhere(bookId), code: coupon },
  })
}
