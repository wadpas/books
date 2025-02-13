import { formatCurrency } from '@/lib/formatters'
import { Button, Column, Img, Row, Section, Text } from '@react-email/components'

type OrderInformationProps = {
  order: { id: string; createdAt: Date; totalPrice: number }
  book: { title: string; description: string; coverPath: string }
  downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

export function OrderInformation({ order, book, downloadVerificationId }: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Номер замовлення</Text>
            <Text className='mt-0 mr-4'>{order.id}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Дата</Text>
            <Text className='mt-0 mr-4'>{dateFormatter.format(order.createdAt)}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Сума</Text>
            <Text className='mt-0 mr-4'>{formatCurrency(order.totalPrice / 100)}</Text>
          </Column>
        </Row>
      </Section>
      <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
        <Img
          width='100%'
          alt={book.title}
          src={`http://localhost:3000/${book.coverPath}`}
        />
        <div>{`http://localhost:3000/${book.coverPath}`}</div>
        <Row className='mt-8'>
          <Column className='align-bottom'>
            <Text className='text-lg font-bold m-0 mr-4'>{book.title}</Text>
          </Column>
          <Column align='right'>
            <Button
              href={`${process.env.NEXT_PUBLIC_URL}/books/download/${downloadVerificationId}`}
              className='bg-black text-white px-6 py-4 rounded text-lg'>
              Завантажити
            </Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className='text-gray-500 mb-0'>{book.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  )
}
