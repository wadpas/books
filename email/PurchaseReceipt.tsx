import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components'
import { OrderInformation } from './components/OrderInformation'

type PurchaseReceiptEmailProps = {
  book: {
    title: string
    coverPath: string
    description: string
  }
  order: { id: string; createdAt: Date; totalPrice: number }
  downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
  book: {
    title: 'Книга Річка золотих кісток',
    coverPath: '1.jpg',
    description:
      'Близнючки Келла і Браяр все життя ховалися від могутньої чаклунки, яка зруйнувала їхнє королівство, і від людей, які не знають, що вони вовки. ',
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    totalPrice: 10000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({ book, order, downloadVerificationId }: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {book.title} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Квитанція про покупку</Heading>
            <OrderInformation
              order={order}
              book={book}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
