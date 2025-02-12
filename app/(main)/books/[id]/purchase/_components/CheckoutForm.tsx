'use client'

import { userOrderExists } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import { FormEvent, useState } from 'react'

type CheckoutFormProps = {
  book: {
    id: string
    title: string
    author: string
    price: number
    coverPath: string
    description: string
  }
  clientSecret: string
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export function CheckoutForm({ book, clientSecret }: CheckoutFormProps) {
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
          <div className='text-lg'>{formatCurrency(book.price)}</div>
          <h1 className='text-2xl font-bold'>{book.title}</h1>
          <div className='line-clamp-3 text-muted-foreground'>{book.description}</div>
        </div>
      </div>
      <Elements
        options={{ clientSecret }}
        stripe={stripePromise}>
        <Form book={book} />
      </Elements>
    </div>
  )
}

function Form({
  book,
}: {
  book: {
    id: string
    price: number
  }
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return

    setIsLoading(true)

    const orderExists = await userOrderExists(email, book.id)

    if (orderExists) {
      setErrorMessage('You have already purchased this product. Try downloading it from the My Orders page')
      setIsLoading(false)
      return
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/books/${book.id}/success`,
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
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className='mt-3'>
            <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size='lg'
            disabled={stripe == null || elements == null || isLoading}>
            {isLoading ? 'Purchasing...' : ` Purchase - ${formatCurrency(book.price)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
