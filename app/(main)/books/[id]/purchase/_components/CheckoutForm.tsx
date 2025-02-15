'use client'

import { createPaymentIntent, userOrderExists } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDiscount } from '@/lib/formatters'
import { Label } from '@radix-ui/react-label'
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useRef, useState } from 'react'
import { DiscountType } from '@prisma/client'
import { getDiscountedAmount } from '@/lib/discountHelpers'

type CheckoutFormProps = {
  book: {
    id: string
    title: string
    author: string
    price: number
    coverPath: string
    description: string
  }
  discount?: {
    id: string
    discountAmount: number
    discountType: DiscountType
  }
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export function CheckoutForm({ book, discount }: CheckoutFormProps) {
  const amount = discount == null ? book.price : getDiscountedAmount(discount, book.price)
  const isDiscounted = amount !== book.price

  return (
    <div className='w-full max-w-5xl mx-auto space-y-8'>
      <div className='flex items-center gap-4'>
        <div className='relative flex-shrink-0 w-1/3 aspect-video'>
          <Image
            src={book.coverPath}
            fill
            alt='Book cover'
          />
        </div>
        <div>
          <div className='text-lg flex gap-4 items-baseline'>
            <div className={isDiscounted ? 'line-through text-muted-foreground text-sm' : ''}>
              {formatCurrency(book.price)}
            </div>
            {isDiscounted && <div className=''>{formatCurrency(amount)}</div>}
          </div>
          <h1 className='text-2xl font-bold'>{book.title}</h1>
          <div className='line-clamp-3 text-muted-foreground'>{book.description}</div>
        </div>
      </div>
      <Elements
        options={{ amount, mode: 'payment', currency: 'usd' }}
        stripe={stripePromise}>
        <Form
          bookId={book.id}
          discount={discount}
          amount={amount}
        />
      </Elements>
    </div>
  )
}

function Form({
  bookId,
  discount,
  amount,
}: {
  bookId: string
  amount: number
  discount?: {
    id: string
    discountAmount: number
    discountType: DiscountType
  }
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()
  const discountRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const coupon = searchParams.get('coupon')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return

    setIsLoading(true)

    const formSubmit = await elements.submit()
    if (formSubmit.error != null) {
      setErrorMessage(formSubmit.error.message)
      setIsLoading(false)
      return
    }

    const paymentIntent = await createPaymentIntent(email, bookId, discount?.id)
    if (paymentIntent.error != null) {
      setErrorMessage(paymentIntent.error)
      setIsLoading(false)
      return
    }

    const orderExists = await userOrderExists(email, bookId)

    if (orderExists) {
      setErrorMessage('You have already purchased this product. Try downloading it from the My Orders page')
      setIsLoading(false)
      return
    }

    stripe
      .confirmPayment({
        elements,
        clientSecret: paymentIntent.clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/books/${bookId}/success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && <CardDescription className='text-destructive'>{errorMessage}</CardDescription>}
          {coupon != null && discount == null && <div>Invalid discount code</div>}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className='mt-3'>
            <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
          </div>
          <div className='space-y-2 mt-4'>
            <Label htmlFor='discount'>Акційний код</Label>
            <div className='flex gap-4 items-center'>
              <Input
                id='discount'
                type='text'
                name='discount'
                className='max-w-xs w-full'
                defaultValue={coupon || ''}
                ref={discountRef}
              />
              <Button
                type='button'
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('coupon', discountRef.current?.value || '')
                  router.push(`${pathname}?${params.toString()}`)
                }}>
                Застосувати
              </Button>
              {discount != null && <div className='text-muted-foreground'>{formatDiscount(discount)} discount</div>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size='lg'
            disabled={stripe == null || elements == null || isLoading}>
            {isLoading ? 'Purchasing...' : ` Purchase - ${formatCurrency(amount)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
