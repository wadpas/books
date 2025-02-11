import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

type BookCardProps = {
  id: string
  title: string
  price: number
  description: string
  coverPath: string
}

export function BookCard({ id, title, price, description, coverPath }: BookCardProps) {
  return (
    <Card className='flex overflow-hidden flex-col'>
      <div className='relative w-full h-auto aspect-video'>
        <Image
          src={coverPath}
          fill
          alt={title}
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{formatCurrency(price)}</CardDescription>
      </CardHeader>
      <CardContent className='flex-grow'>
        <p className='line-clamp-4'>{description}</p>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          size='lg'
          className='w-full'>
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function BookCardSkeleton() {
  return (
    <Card className='overflow-hidden flex flex-col animate-pulse'>
      <div className='w-full aspect-video bg-gray-300' />
      <CardHeader>
        <CardTitle>
          <div className='w-3/4 h-6 rounded-full bg-gray-300' />
        </CardTitle>
        <CardDescription>
          <div className='w-1/2 h-4 rounded-full bg-gray-300' />
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='w-full h-4 rounded-full bg-gray-300' />
        <div className='w-full h-4 rounded-full bg-gray-300' />
        <div className='w-3/4 h-4 rounded-full bg-gray-300' />
      </CardContent>
      <CardFooter>
        <Button
          className='w-full'
          disabled
          size='lg'></Button>
      </CardFooter>
    </Card>
  )
}
