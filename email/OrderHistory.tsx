import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from '@react-email/components'
import { OrderInformation } from './components/OrderInformation'
import React from 'react'

type OrderHistoryEmailProps = {
  orders: {
    id: string
    totalPrice: number
    createdAt: Date
    downloadVerificationId: string
    book: {
      title: string
      coverPath: string
      description: string
    }
  }[]
}

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      totalPrice: 10000,
      downloadVerificationId: crypto.randomUUID(),
      book: {
        title: 'Book name',
        coverPath: '1.jpg',
        description: 'Some description',
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      totalPrice: 2000,
      downloadVerificationId: crypto.randomUUID(),
      book: {
        title: 'Book name 2',
        coverPath: '1.jpg',
        description: 'Some other desc',
      },
    },
  ],
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  book={order.book}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
